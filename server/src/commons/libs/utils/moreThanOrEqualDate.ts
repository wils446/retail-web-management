import { format } from 'date-fns';
import { Raw } from 'typeorm';

export const MoreThanOrEqualDate = (isoDate: string) =>
  Raw(
    (alias) => `${alias} >= '${format(new Date(isoDate), 'yyyy-MM-dd')}'::date`,
  );
