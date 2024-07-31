import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReturnByIdQuery } from './get-return-by-id.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Return } from 'return/entities';
import { ReturnRepository } from 'return/repositories';

@QueryHandler(GetReturnByIdQuery)
export class GetReturnByIdHandler implements IQueryHandler<GetReturnByIdQuery> {
  constructor(
    @InjectRepository(Return)
    private readonly returnRepository: ReturnRepository,
  ) {}

  async execute(query: GetReturnByIdQuery): Promise<any> {
    const retur = await this.returnRepository.findOneOrThrow({
      where: { id: query.returnId },
      relations: {
        returnItem: true,
      },
    });

    return retur;
  }
}
