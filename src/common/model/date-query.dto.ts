import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class DateQueryDto {
    @IsDate()
    @Type(() => Date)
    date: Date = new Date();
}