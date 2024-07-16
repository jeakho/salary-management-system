import { IsNumber, IsOptional, Validate, ValidationArguments } from "class-validator";
import { StaffMemberExistsRule } from "../validation-rule/staffMemberExists.rule";
import { StaffMemberIsNotEmployeeRule } from "../validation-rule/staffMemberIsNotEmployee.rule";

export class StaffRelationDto {
    @IsNumber()
    @Validate(StaffMemberExistsRule)
    staffMemberId: number;

    @IsOptional()
    @IsNumber()
    @Validate(StaffMemberExistsRule, { message: (args: ValidationArguments) => `Supervisor with ID '${args.value}' not found.` })
    @Validate(StaffMemberIsNotEmployeeRule, { message: 'Supervisor cannot be an employee' })
    supervisorId: number = null;
}