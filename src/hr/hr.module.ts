import { Module } from '@nestjs/common';
import { StaffRelationsService } from './service/staff-relations.service';
import { StaffService } from './service/staff.service';
import { StaffController } from './controller/staff.controller';
import { StaffRelationsController } from './controller/staff-relations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffMember } from './model/staff.entity';
import { StaffRelation } from './model/staff-relation.entity';
import { StaffMemberExistsRule } from './validation-rule/staffMemberExists.rule';
import { StaffMemberIsNotEmployeeRule } from './validation-rule/staffMemberIsNotEmployee.rule';
import { StaffMemberHasNoSubordinatesRule } from './validation-rule/staffMemberHasNoSubordinates.rule';

@Module({
    imports: [TypeOrmModule.forFeature([StaffMember, StaffRelation])],
    providers: [StaffRelationsService, StaffService, StaffMemberExistsRule, StaffMemberIsNotEmployeeRule, StaffMemberHasNoSubordinatesRule],
    controllers: [StaffController, StaffRelationsController],
    exports: [StaffService]
})
export class HrModule {}
