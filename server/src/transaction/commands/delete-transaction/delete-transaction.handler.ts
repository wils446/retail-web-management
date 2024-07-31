import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from 'history/entities';
import { Transaction } from 'transaction/entities/transaction.entity';
import { TransactionRepository } from 'transaction/repositories';
import { DataSource, QueryRunner } from 'typeorm';
import { DeleteTransactionCommand } from './delete-transaction.command';

@CommandHandler(DeleteTransactionCommand)
export class DeleteTransactionHandler
  implements ICommandHandler<DeleteTransactionCommand>
{
  private queryRunner: QueryRunner;

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: TransactionRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(
    command: DeleteTransactionCommand,
  ): Promise<{ message: string }> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      const transaction = await this.deleteTransaction(command);
      await this.createHistory(command, transaction);
      await this.queryRunner.commitTransaction();
      return { message: `${command.transactionid} deleted` };
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async deleteTransaction(command: DeleteTransactionCommand) {
    const transactionRepo =
      await this.queryRunner.manager.getRepository(Transaction);

    const transaction = await this.transactionRepository.findOneByOrThrow({
      id: command.transactionid,
    });

    const result = await transactionRepo.delete({
      id: command.transactionid,
    });

    if (result.affected === 0)
      throw new NotFoundException(
        `transaction with id ${command.transactionid} is not found`,
      );

    return transaction;
  }

  async createHistory(
    command: DeleteTransactionCommand,
    deletedTransaction: Transaction,
  ) {
    const historyRepo = await this.queryRunner.manager.getRepository(History);
    try {
      const history = await historyRepo.create({
        text: `${command.user.username} menghapus transaksi ${deletedTransaction.name}`,
        type: 'delete',
      });
      await historyRepo.save(history);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
