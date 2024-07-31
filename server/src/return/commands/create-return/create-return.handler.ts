import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { generateInvoiceNumber } from 'commons/libs/utils';
import { History } from 'history/entities';
import { Item, ItemStock } from 'item/entities';
import { ItemRepository, ItemStockRepository } from 'item/repositories';
import { Order } from 'order/entities';
import { OrderRepository } from 'order/repositories';
import { ReturnItemDto } from 'return/dtos/return-item.dto';
import { Return, ReturnItem } from 'return/entities';
import { ReturnItemRepository, ReturnRepository } from 'return/repositories';
import { Transaction, TransactionItem } from 'transaction/entities';
import {
  TransactionItemRepository,
  TransactionRepository,
} from 'transaction/repositories';
import { Between, DataSource, QueryRunner } from 'typeorm';
import { CreateReturnCommand } from './create-return.command';

@CommandHandler(CreateReturnCommand)
export class CreateReturnHandler
  implements ICommandHandler<CreateReturnCommand>
{
  private queryRunner: QueryRunner;

  constructor(
    @InjectRepository(Return)
    private readonly returnRepository: ReturnRepository,
    @InjectRepository(ReturnItem)
    private readonly returnItemRepository: ReturnItemRepository,
    @InjectRepository(Transaction)
    private readonly transactionRepository: TransactionRepository,
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
    @InjectRepository(Item)
    private readonly itemRepository: ItemRepository,
    @InjectRepository(ItemStock)
    private readonly itemStockRepository: ItemStockRepository,
    @InjectRepository(TransactionItem)
    private readonly transactionItemRepository: TransactionItemRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: CreateReturnCommand): Promise<any> {
    this.queryRunner = this.dataSource.createQueryRunner();
    this.queryRunner.connect();
    this.queryRunner.startTransaction();

    try {
      const newReturn = await this.createReturn(command);

      if (newReturn.type === 'order')
        await this.updateOrder(newReturn.id, newReturn.targetId);
      else await this.updateTransaction(newReturn.id, newReturn.targetId);

      await this.insertReturnItems(command, newReturn);
      await this.createHistory(command);
      await this.queryRunner.commitTransaction();
      return await this.returnRepository.findOne({
        where: { id: newReturn.id },
        relations: { returnItem: true },
      });
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async createReturn(command: CreateReturnCommand) {
    const invoiceNumber = await this.generateInvoice();
    const data = await this.getTargetData(command);
    const newReturn = await this.returnRepository.create({
      name: data.name,
      targetId: command.returnData.targetId,
      type: command.returnData.type,
      invoiceNumber,
    });

    try {
      await this.queryRunner.manager.save(newReturn);
      return newReturn;
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async getTargetData(command: CreateReturnCommand) {
    const targetType = command.returnData.type;
    let targetData: Order | Transaction;

    if (targetType === 'transaction')
      targetData = await this.transactionRepository.findOneByOrThrow({
        id: command.returnData.targetId,
      });
    else
      targetData = await this.orderRepository.findOneByOrThrow({
        id: command.returnData.targetId,
      });

    return targetData;
  }

  async generateInvoice() {
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const todayEnd = new Date(todayStart.getTime() + 86400000);

    const count = await this.returnRepository.countBy({
      created_at: Between(todayStart, todayEnd),
    });

    return generateInvoiceNumber('return', count);
  }

  async insertReturnItems(command: CreateReturnCommand, newReturn: Return) {
    await Promise.all([
      ...command.returnData.items.map(async (item) => {
        const targetItem = await this.itemRepository.findOneByOrThrow({
          id: item.itemId,
        });

        const returnItem = await this.returnItemRepository.create({
          name: targetItem.name,
          item: targetItem,
          quantity: item.quantity,
          returnPrice: item.returnPrice,
          return: newReturn,
        });

        try {
          await this.queryRunner.manager.save(returnItem);
          await this.updateItemStock(command, item);
        } catch (err) {
          throw err;
        }
      }),
    ]);
  }

  async updateItemStock(command: CreateReturnCommand, item: ReturnItemDto) {
    if (command.returnData.type === 'transaction')
      await this.updateTransactedStock(command.returnData.targetId, item);
    else if (command.returnData.type === 'order')
      await this.updateOrderedStock(command.returnData.targetId, item);
  }

  async updateOrderedStock(orderId: string, item: ReturnItemDto) {
    const itemStock = await this.itemStockRepository.findOneByOrThrow({
      order: {
        id: orderId,
      },
      item: {
        id: item.itemId,
      },
    });

    if (itemStock.stock < item.quantity) {
      throw new BadRequestException('quantity is bigger than stock');
    }

    if (itemStock.stock === item.quantity)
      return await this.deleteItemStock(itemStock.id);

    itemStock.stock -= item.quantity;

    try {
      await this.queryRunner.manager.save(itemStock);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async updateTransactedStock(transactionId: string, item: ReturnItemDto) {
    let qty = item.quantity;
    const transactionItem =
      await this.transactionItemRepository.findOneByOrThrow({
        item: {
          id: item.itemId,
        },
        transaction: {
          id: transactionId,
        },
      });

    if (transactionItem.quantity < item.quantity) {
      throw new BadRequestException('quantity is bigger than stock');
    }

    if (!item.isSellable) return;
    const updateStocks = transactionItem.stocks.map((itemStock) => {
      if (qty <= 0) return;
      let stock: { quantity: number; cost: number };

      if (qty > itemStock.stock)
        stock = { quantity: itemStock.stock, cost: itemStock.cost };
      else {
        stock = { quantity: qty, cost: itemStock.cost };
      }

      qty -= itemStock.stock;

      return { ...stock, orderId: itemStock.orderId };
    });

    await Promise.all([
      ...updateStocks.map(async (stock) => {
        let itemStock: ItemStock;

        itemStock = await this.itemStockRepository.findOneBy({
          orderId: stock.orderId,
          itemId: transactionItem.itemId,
        });
        if (!itemStock)
          itemStock = await this.itemStockRepository.create({
            stock: 0,
            item: transactionItem.item,
            cost: stock.cost,
            orderId: stock.orderId,
          });

        itemStock.stock += stock.quantity;

        try {
          await this.queryRunner.manager.save(itemStock);
        } catch (err) {
          throw new InternalServerErrorException((err as Error).message);
        }
      }),
    ]);
  }

  async deleteItemStock(itemStockId: string) {
    const itemStockRepo =
      await this.queryRunner.manager.getRepository(ItemStock);
    const result = await itemStockRepo.delete({ id: itemStockId });
    if (!result) throw new NotFoundException('item stock is not found');
  }

  async createHistory(command: CreateReturnCommand) {
    const historyRepo = await this.queryRunner.manager.getRepository(History);
    try {
      const history = await historyRepo.create({
        text: `${command.user.username} menambahkan retur`,
        type: 'create',
      });
      await historyRepo.save(history);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async updateTransaction(returnId: string, transactionId: string) {
    const transaction = await this.transactionRepository.findOneByOrThrow({
      id: transactionId,
    });

    transaction.returnId = returnId;

    try {
      await this.queryRunner.manager.save(transaction);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async updateOrder(returnId: string, orderId: string) {
    const order = await this.orderRepository.findOneByOrThrow({
      id: orderId,
    });

    order.returnId = returnId;

    try {
      await this.queryRunner.manager.save(order);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
