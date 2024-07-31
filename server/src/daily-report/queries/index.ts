export * from './get-daily-report';

import { Provider } from '@nestjs/common';
import { GetDailyReportHandler } from './get-daily-report';

export const QueryHandlers: Provider[] = [GetDailyReportHandler];
