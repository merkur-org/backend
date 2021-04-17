import { addYears, subYears } from 'date-fns';
import { Between, FindOperator } from 'typeorm';

export const AfterDate = (date: Date): FindOperator<Date> =>
  Between(date, addYears(date, 100));

export const BeforeDate = (date: Date): FindOperator<Date> =>
  Between(subYears(date, 100), date);
