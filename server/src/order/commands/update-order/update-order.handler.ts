import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from 'history/entities';
import { Order } from 'order/entities';
import { OrderRepository } from 'order/repositories';
import { DataSource, QueryRunner } from 'typeorm';
import { UpdateOrderCommand } from './update-order.command';

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderHandler implements ICommandHandler<UpdateOrderCommand> {
  private queryRunner: QueryRunner;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: UpdateOrderCommand): Promise<Order> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      const { newOrder, oldOrder } = await this.updateOrder(command);
      await this.createHistory(command, oldOrder, newOrder);
      await this.queryRunner.commitTransaction();
      return newOrder;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async updateOrder(command: UpdateOrderCommand) {
    const order = await this.orderRepository.findOneByOrThrow({
      id: command.orderId,
    });
    const oldOrder = { ...order };

    if (command.updateOrder.paid !== undefined)
      order.paid = command.updateOrder.paid;
    if (command.updateOrder.status !== undefined)
      order.status = command.updateOrder.status;

    try {
      await this.queryRunner.manager.save(order);
      return { oldOrder, newOrder: order };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async createHistory(
    command: UpdateOrderCommand,
    oldOrder: Order,
    newOrder: Order,
  ) {
    const historyRepo = await this.queryRunner.manager.getRepository(History);
    try {
      const history = historyRepo.create({
        text: `${command.user.username} melakukan perubahan pada order ${oldOrder.name}`,
        type: 'update',
        detail: JSON.stringify({ oldOrder, newOrder }),
      });
      await historyRepo.save(history);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
