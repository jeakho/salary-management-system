import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { StaffMember } from "../model/staff.entity";
import { Repository } from "typeorm";
import { StaffRelation } from "../model/staff-relation.entity";

@ValidatorConstraint({ name: 'StaffMemberHasNoSubordinates', async: true })
@Injectable()
export class StaffMemberHasNoSubordinatesRule implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(StaffRelation)
    private readonly staffRelationRepository: Repository<StaffRelation>,
  ) {}

  async validate(staffMemberId: number) {
    const staffMemberRelations = await this.staffRelationRepository.find({ where: { supervisorId: staffMemberId } });

    return !staffMemberRelations.length
  }

  defaultMessage() {
    return `Cannot remove a staff member that has subordinates! Reassign subordinates first`;
  }
}