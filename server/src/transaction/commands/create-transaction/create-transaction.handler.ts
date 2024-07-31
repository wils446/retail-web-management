import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, QueryRunner } from 'typeorm';

import { Cart, CartItem } from 'cart/entities';
import { CartRepository } from 'cart/repositories';
import { generateInvoiceNumber } from 'commons/libs/utils';
import { History } from 'history/entities';
import { ItemStock } from 'item/entities';
import { ItemStockRepository } from 'item/repositories';
import { TransactionItem, TransactionItemStock } from 'transaction/entities';
import { Transaction } from 'transaction/entities/transaction.entity';
import {
  TransactionItemRepository,
  TransactionRepository,
} from 'transaction/repositories';
import { TransactionItemStockRepository } from 'transaction/repositories/transaction-item-stock.repository';
import { CreateTransactionCommand } from './create-transaction.command';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  private queryRunner: QueryRunner;

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: TransactionRepository,
    @InjectRepository(Cart)
    private readonly cartRepository: CartRepository,
    @InjectRepository(ItemStock)
    private readonly itemStockRepository: ItemStockRepository,
    @InjectRepository(TransactionItem)
    private readonly transactionItemRepository: TransactionItemRepository,
    @InjectRepository(TransactionItemStock)
    private readonly transactionItemStockRepository: TransactionItemStockRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: CreateTransactionCommand): Promise<any> {
    this.queryRunner = this.dataSource.createQueryRunner();
    this.queryRunner.connect();
    this.queryRunner.startTransaction();

    const cart = await this.cartRepository.findOneByOrThrow({
      id: command.transaction.cartId,
    });

    try {
      const transaction = await this.createTransaction(command);
      await this.createHistory(command, cart);
      await this.insertTransactionItem(transaction, cart.cartItems);
      await this.deleteCart(cart);
      await this.queryRunner.commitTransaction();
      return await this.transactionRepository.findOneByOrThrow({
        id: transaction.id,
      });
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async createTransaction({ transaction, user }: CreateTransactionCommand) {
    const invoiceNumber = await this.generateInvoice();
    const newTransaction = await this.transactionRepository.create({
      name: transaction.name,
      checkoutUser: user,
      paid: transaction.paid,
      createdBy: user.username,
      discount: transaction.discount,
      totalPrice: transaction.totalPrice,
      invoiceNumber,
      address: {
        address: transaction.address,
        city: transaction.city,
        country: transaction.country,
        postalCode: transaction.postalCode,
        province: transaction.province,
      },
    });

    try {
      await this.queryRunner.manager.save(newTransaction);
      return newTransaction;
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async generateInvoice() {
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const todayEnd = new Date(todayStart.getTime() + 86400000);

    const count = await this.transactionRepository.countBy({
      created_at: Between(todayStart, todayEnd),
    });

    return generateInvoiceNumber('transaction', count);
  }

  async deleteCart(cart: Cart) {
    const result = await this.cartRepository.delete({ id: cart.id });
    if (result.affected === 0)
      throw new NotFoundException(`cart with id ${cart.id} is not found`);
  }

  async insertTransactionItem(transaction: Transaction, cartItem: CartItem[]) {
    await Promise.all([
      ...cartItem.map(async (cartItem) => {
        const transactionItem = await this.transactionItemRepository.create({
          name: cartItem.item.name,
          quantity: cartItem.quantity,
          price: cartItem.price,
          item: cartItem.item,
          transaction,
        });

        try {
          await this.queryRunner.manager.save(transactionItem);
          await this.updateStockItem(transactionItem, cartItem);
        } catch (err) {
          throw new InternalServerErrorException((err as Error).message);
        }
      }),
    ]);
  }

  async updateStockItem(transactionItem: TransactionItem, cartItem: CartItem) {
    let tempStock = cartItem.quantity;

    const [itemStocks, itemStockCounts] =
      await this.itemStockRepository.findAndCount({
        where: { item: { id: cartItem.item.id } },
        order: {
          created_at: 'ASC',
        },
      });

    const totalStock =
      itemStockCounts === 0
        ? 0
        : itemStocks.reduce((prev, curr) => prev + curr.stock, 0);

    if (cartItem.quantity > totalStock)
      throw new ConflictException(
        'the requested quantity exceeds the available inventory',
      );

    for (const itemStock of itemStocks) {
      let changeCount = tempStock;
      if (changeCount <= 0) break;

      if (changeCount > itemStock.stock) changeCount = itemStock.stock;

      if (changeCount === itemStock.stock)
        await this.deleteItemStock(itemStock.id);
      else await this.decreaseItemStock(itemStock.id, changeCount);

      await this.createTransactionItemStock(
        transactionItem,
        itemStock,
        changeCount,
      );

      tempStock -= changeCount;
    }
  }

  async createTransactionItemStock(
    transactionItem: TransactionItem,
    itemStock: ItemStock,
    stock: number,
  ) {
    const newTransactionItemStock =
      await this.transactionItemStockRepository.create({
        cost: itemStock.cost,
        stock,
        transactionItem,
        orderId: itemStock.orderId,
      });

    try {
      await this.queryRunner.manager.save(newTransactionItemStock);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async decreaseItemStock(itemStockId: string, count: number) {
    const itemStock = await this.itemStockRepository.findOneByOrThrow({
      id: itemStockId,
    });

    itemStock.stock -= count;

    try {
      await this.queryRunner.manager.save(itemStock);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async deleteItemStock(itemStockId: string) {
    const itemStockRepo =
      await this.queryRunner.manager.getRepository(ItemStock);
    const result = await itemStockRepo.delete({ id: itemStockId });
    if (!result) throw new NotFoundException('item stock is not found');
  }

  async createHistory(command: CreateTransactionCommand, cart: Cart) {
    const historyRepo = await this.queryRunner.manager.getRepository(History);
    try {
      const history = await historyRepo.create({
        text: `${command.user.username} menambahkan transaksi dari keranjang ${cart.name}`,
        type: 'create',
      });
      await historyRepo.save(history);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
