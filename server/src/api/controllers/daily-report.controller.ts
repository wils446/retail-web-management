import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'api/guards';
import { GetDailyReportQuery } from 'daily-report/queries';

@Controller('daily-report')
@UseGuards(JwtAuthGuard)
export class DailyReportController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getDaily() {
    return await this.queryBus.execute(new GetDailyReportQuery());
  }
}
