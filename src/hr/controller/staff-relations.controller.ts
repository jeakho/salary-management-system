import { Body, Controller, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { StaffRelationDto } from '../model/staff-relation.dto';
import { StaffRelation } from '../model/staff-relation.entity';
import { StaffRelationsService } from '../service/staff-relations.service';

@Controller('relation')
export class StaffRelationsController {
    constructor(private readonly staffRelationServices: StaffRelationsService) { }

    @Patch()
    async alterRelation(@Body() staffRelationDto: StaffRelationDto): Promise<StaffRelation> {
        const { staffMemberId, supervisorId } = staffRelationDto;
        return this.staffRelationServices.createOrUpdateRelation(staffMemberId, supervisorId);
    }
}
