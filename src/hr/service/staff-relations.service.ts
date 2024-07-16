import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StaffRelation } from '../model/staff-relation.entity';
import { Repository } from 'typeorm';
import { StaffRelationDto } from '../model/staff-relation.dto';
import { CreateStaffMemberDto } from 'src/hr/model/create-staff-member.dto';
import { StaffService } from './staff.service';
import { StaffMember } from 'src/hr/model/staff.entity';

@Injectable()
export class StaffRelationsService {
    constructor(
        @InjectRepository(StaffRelation)
        private readonly staffRelationRepository: Repository<StaffRelation>,
    ) { }


    async createOrUpdateRelation(staffMemberId: number, supervisorId: number | null = null): Promise<StaffRelation> {
        let staffMemberRelation = await this.staffRelationRepository.findOne({ where: { staffMemberId } });
        const supervisorRelation = supervisorId ? 
            await this.staffRelationRepository.findOne({ where: { staffMemberId: supervisorId } }) :
            null;

        if (!staffMemberRelation) {
            staffMemberRelation = new StaffRelation();
            staffMemberRelation.staffMemberId = staffMemberId;

        }

        staffMemberRelation.supervisorId = supervisorId;
        staffMemberRelation.path = (supervisorRelation?.path || '') + '/' + staffMemberId;
        staffMemberRelation.pathDepth = (supervisorRelation?.pathDepth || 0) + 1;

        return await this.staffRelationRepository.save(staffMemberRelation);
    }

    async findRelationByStaffMemberId(staffMemberId: number): Promise<StaffRelation> {
        return await this.staffRelationRepository.findOne({ where: { staffMemberId } })
    }
}
