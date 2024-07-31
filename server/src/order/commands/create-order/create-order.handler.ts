import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Between, DataSource, QueryRunner } from 'typeorm';

import { CreateOrderCommand } from './create-order.command';
import { Order, OrderItem } from 'order/entities';
import { OrderItemRepository, OrderRepository } from 'order/repositories';
import { OrderItemDto } from 'order/dtos';
import { ItemRepository, ItemStockRepository } from 'item/repositories';
import { Item, ItemStock } from 'item/entities';
import { History } from 'history/entities';
import { generateInvoiceNumber } from 'commons/libs/utils';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  private queryRunner: QueryRunner;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: OrderItemRepository,
    @InjectRepository(Item)
    private readonly itemRepository: ItemRepository,
    @InjectRepository(ItemStock)
    private readonly itemStockRepository: ItemStockRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: CreateOrderCommand): Promise<Order> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const order = await this.createOrder(command);
      await this.createHistory(command);
      await this.queryRunner.commitTransaction();
      return await this.orderRepository.findOneByOrThrow({ id: order.id });
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async createOrder({ createOrderDto, user }: CreateOrderCommand) {
    const invoiceNumber = await this.generateInvoice();
    const newOrder = await this.orderRepository.create({
      name: createOrderDto.name,
      paid: createOrderDto.paid,
      items: [],
      invoiceNumber,
      createdById: user.id,
    });

    try {
      await this.queryRunner.manager.save(newOrder);
      await this.addOrderItem(createOrderDto.items, newOrder);
      return newOrder;
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

    const count = await this.orderRepository.countBy({
      created_at: Between(todayStart, todayEnd),
    });

    return generateInvoiceNumber('order', count);
  }

  async addOrderItem(items: OrderItemDto[], order: Order) {
    await Promise.all([
      ...items.map(async (item) => {
        const targetItem = await this.itemRepository.findOneByOrThrow({
          id: item.itemId,
        });

        const stockItem = await this.itemStockRepository.create({
          stock: item.quantity,
          item: targetItem,
          cost: item.cost / item.quantity,
          order,
        });

        let orderItem = await this.orderItemRepository.findOneBy({
          item: targetItem,
          order: { id: order.id },
        });

        if (!orderItem)
          orderItem = await this.orderItemRepository.create({
            item: targetItem,
            order: order,
            quantity: 0,
            cost: 0,
            name: targetItem.name,
          });

        orderItem.quantity += item.quantity;
        orderItem.cost += item.cost;

        // * delete soon
        // targetItem.quantity += item.quantity;

        try {
          await this.queryRunner.manager.save(orderItem);
          await this.queryRunner.manager.save(stockItem);
          // * delete soon
          // await this.queryRunner.manager.save(targetItem);
        } catch (err) {
          throw new InternalServerErrorException((err as Error).message);
        }
      }),
    ]);
  }

  async createHistory(command: CreateOrderCommand) {
    const historyRepo = await this.queryRunner.manager.getRepository(History);
    try {
      const history = await historyRepo.create({
        text: `${command.user.username} menambahkan order ${command.createOrderDto.name}`,
        type: 'create',
      });
      await historyRepo.save(history);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
