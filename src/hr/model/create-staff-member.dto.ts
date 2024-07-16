import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { StaffMemberType } from "./staff.entity";
import { Type } from "class-transformer";

export class CreateStaffMemberDto {
    @IsNotEmpty({ message: 'Name must be specified' })
    @IsString()
    name: string;

    @IsNotEmpty({ message: 'Type must be specified' })
    @IsEnum(StaffMemberType)
    type: StaffMemberType;

    @IsNotEmpty({ message: 'Entrance date must be specified' })
    @IsDate({ message: 'Entrance date must be a valid date' })
    @Type(() => Date)
    entranceDate: Date;
}