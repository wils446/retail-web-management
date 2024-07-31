import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDailyReportQuery } from './get-daily-report.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'transaction/entities';
import { TransactionRepository } from 'transaction/repositories';
import { Order } from 'order/entities';
import { OrderRepository } from 'order/repositories';
import { Return } from 'return/entities';
import { ReturnRepository } from 'return/repositories';
import { Between } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

@QueryHandler(GetDailyReportQuery)
export class GetDailyReportHandler
  implements IQueryHandler<GetDailyReportQuery>
{
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: TransactionRepository,
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
    @InjectRepository(Return)
    private readonly returnRepository: ReturnRepository,
  ) {}

  async execute(): Promise<any> {
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const todayEnd = new Date(todayStart.getTime() + 86400000);

    try {
      const transactions = await this.getTodayTransactions(
        todayStart,
        todayEnd,
      );
      const orders = await this.getTodayOrders(todayStart, todayEnd);
      const orderReturns = await this.getTodayOrderReturns(
        todayStart,
        todayEnd,
      );
      const transactionReturns = await this.getTodayTransactionReturns(
        todayStart,
        todayEnd,
      );

      return { transactions, orders, orderReturns, transactionReturns };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async getTodayTransactions(start: Date, end: Date) {
    const [transactions, count] =
      await this.transactionRepository.findAndCountBy({
        created_at: Between(start, end),
      });

    return {
      data: transactions.map((transaction) => ({
        id: transaction.id,
        name: transaction.name,
        totalPriceOrCost: transaction.items.reduce(
          (prev, curr) => prev + curr.price,
          0,
        ),
        totalItems: transaction.items.reduce(
          (prev, curr) => prev + curr.quantity,
          0,
        ),
        createdAt: transaction.created_at,
      })),
      count,
    };
  }

  async getTodayOrders(start: Date, end: Date) {
    const [orders, count] = await this.orderRepository.findAndCountBy({
      created_at: Between(start, end),
    });
    return {
      data: orders.map((order) => ({
        id: order.id,
        name: order.name,
        totalPriceOrCost: order.items.reduce(
          (prev, curr) => prev + curr.cost,
          0,
        ),
        totalItems: order.items.reduce((prev, curr) => prev + curr.quantity, 0),
        createdAt: order.created_at,
      })),

      count,
    };
  }

  async getTodayOrderReturns(start: Date, end: Date) {
    const [returns, count] = await this.returnRepository.findAndCountBy({
      type: 'order',
      created_at: Between(start, end),
    });
    return {
      data: returns.map((retur) => ({
        id: retur.id,
        name: retur.name,
        totalPriceOrCost: retur.returnItem.reduce(
          (prev, curr) => prev + curr.returnPrice,
          0,
        ),
        totalItems: retur.returnItem.reduce(
          (prev, curr) => curr.quantity + prev,
          0,
        ),
        createdAt: retur.created_at,
      })),
      count,
    };
  }

  async getTodayTransactionReturns(start: Date, end: Date) {
    const [data, count] = await this.returnRepository.findAndCountBy({
      type: 'transaction',
      created_at: Between(start, end),
    });
    return {
      data: data.map((retur) => ({
        id: retur.id,
        name: retur.name,
        totalPriceOrCost: retur.returnItem.reduce(
          (prev, curr) => prev + curr.returnPrice,
          0,
        ),
        totalItems: retur.returnItem.reduce(
          (prev, curr) => curr.quantity + prev,
          0,
        ),
        createdAt: retur.created_at,
      })),
      count,
    };
  }
}
