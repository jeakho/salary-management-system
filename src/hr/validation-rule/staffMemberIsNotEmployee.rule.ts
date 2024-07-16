import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { StaffMember, StaffMemberType } from "../model/staff.entity";
import { Repository } from "typeorm";

@ValidatorConstraint({ name: 'StaffMemberIsNotEmployee', async: true })
@Injectable()
export class StaffMemberIsNotEmployeeRule implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(StaffMember)
    private readonly staffRepository: Repository<StaffMember>,
  ) {}

  async validate(staffMemberId: number) {
    const staffMember = await this.staffRepository.findOne({ where: { id: staffMemberId } });

    return staffMember.type !== StaffMemberType.Employee;
  }

  defaultMessage(args: ValidationArguments) {
    const { value: staffMemberId } = args;

    return `Staff member with ID '${staffMemberId}' is employee`;
  }
}