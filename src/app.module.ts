import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffMember } from './hr/model/staff.entity';
import { StaffRelation } from './hr/model/staff-relation.entity';
import { HrModule } from './hr/hr.module';
import { AccountingModule } from './accounting/accounting.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/staffManagement.db',
      synchronize: true,
      entities: [StaffMember, StaffRelation]
    }),
    HrModule,
    AccountingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
