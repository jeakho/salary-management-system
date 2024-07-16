import { Module } from '@nestjs/common';
import { SalaryService } from './service/salary.service';
import { SalaryController } from './controller/salary.controller';
import { HrModule } from 'src/hr/hr.module';

@Module({
    imports: [HrModule],
    providers: [SalaryService],
    controllers: [SalaryController]
})
export class AccountingModule {}
