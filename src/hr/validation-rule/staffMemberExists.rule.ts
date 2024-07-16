import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { StaffMember } from "../model/staff.entity";
import { Repository } from "typeorm";

@ValidatorConstraint({ name: 'StaffMemberExists', async: true })
@Injectable()
export class StaffMemberExistsRule implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(StaffMember)
    private readonly staffRepository: Repository<StaffMember>,
  ) {}

  async validate(staffMemberId: number) {
    const staffMember = await this.staffRepository.findOne({ where: { id: staffMemberId } })

    return !!staffMember;
  }

  defaultMessage(args: ValidationArguments) {
    const { value: staffMemberId } = args;

    return `Staff member with ID '${staffMemberId}' does not exist`;
  }
}