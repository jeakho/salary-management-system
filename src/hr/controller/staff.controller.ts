import { Body, Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { StaffService } from '../service/staff.service';
import { CreateStaffMemberDto } from '../model/create-staff-member.dto';
import { StaffMember } from '../model/staff.entity';
import { RemoveStaffMemberDto } from '../model/remove-staff-member.dto';

@Controller('staff')
export class StaffController {
    constructor(private readonly staffService: StaffService) { }

    @Post()
    async createStaffMember(@Body() staffMemberDto: CreateStaffMemberDto): Promise<StaffMember> {
        const staffMember = await this.staffService.createStaffMember(staffMemberDto);
        return staffMember;
    }

    @Delete(':id')
    removeStaffMember(@Param() removeStaffMemberDto: RemoveStaffMemberDto): Promise<{ message: string }> {
        return this.staffService.removeStaffMemberById(removeStaffMemberDto.id);
    }
}
