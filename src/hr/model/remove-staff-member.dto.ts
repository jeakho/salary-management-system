import { Type } from "class-transformer";
import { IsNumber, Validate } from "class-validator";
import { StaffMemberHasNoSubordinatesRule } from "../validation-rule/staffMemberHasNoSubordinates.rule";

export class RemoveStaffMemberDto {
    @Type(() => Number)
    @IsNumber()
    @Validate(StaffMemberHasNoSubordinatesRule)
    id: number;
}