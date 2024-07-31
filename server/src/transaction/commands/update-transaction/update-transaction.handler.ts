import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { History } from 'history/entities';
import { Transaction } from 'transaction/entities/transaction.entity';
import { TransactionRepository } from 'transaction/repositories';
import { DataSource, QueryRunner } from 'typeorm';
import { UpdateTransactionCommand } from './update-transaction.command';

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionHandler
  implements ICommandHandler<UpdateTransactionCommand>
{
  private queryRunner: QueryRunner;

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: TransactionRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: UpdateTransactionCommand): Promise<any> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      const { newTransaction, oldTransaction } =
        await this.updateTransaction(command);
      await this.createHistory(command, oldTransaction, newTransaction);
      await this.queryRunner.commitTransaction();
      return newTransaction;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async updateTransaction(command: UpdateTransactionCommand) {
    const transaction = await this.transactionRepository.findOneByOrThrow({
      id: command.transactionId,
    });
    const oldTransaction = { ...transaction };

    if (command.transaction.paid !== undefined)
      transaction.paid = command.transaction.paid;
    if (command.transaction.status !== undefined)
      transaction.status = command.transaction.status;

    try {
      await this.queryRunner.manager.save(transaction);
      return { oldTransaction, newTransaction: transaction };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async createHistory(
    command: UpdateTransactionCommand,
    oldTransaction: Transaction,
    newTransaction: Transaction,
  ) {
    const historyRepo = await this.queryRunner.manager.getRepository(History);
    try {
      const history = await historyRepo.create({
        text: `${command.user.username} melakukan perubahan pada transaksi ${oldTransaction.name}`,
        type: 'update',
        detail: JSON.stringify({ oldTransaction, newTransaction }),
      });
      await historyRepo.save(history);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
