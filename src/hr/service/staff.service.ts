import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StaffMember } from '../model/staff.entity';
import { Like, Repository } from 'typeorm';
import { CreateStaffMemberDto } from '../model/create-staff-member.dto';
import { StaffRelationsService } from 'src/hr/service/staff-relations.service';
import { SubordinatesDepthLevel } from '../model/salary-rule';

@Injectable()
export class StaffService {
    constructor(
        @InjectRepository(StaffMember)
        private readonly staffRepository: Repository<StaffMember>,
        private readonly staffRelationsService: StaffRelationsService
    ) { }

    async findAllStaffMembers(): Promise<StaffMember[]> {
        return await this.staffRepository.find();
    }

    async findStaffMemberById(id: number): Promise<StaffMember> {
        const staffMember = await this.staffRepository.findOne({ where: { id } });
        if (!staffMember) {
            throw new NotFoundException(`Staff member with ID '${id}' not found`);
        }

        return staffMember;
    }

    async createStaffMember(staffMemberDto: CreateStaffMemberDto): Promise<StaffMember> {
        let staffMember = this.staffRepository.create(staffMemberDto);
        staffMember = await this.staffRepository.save(staffMember);

        const relation = await this.staffRelationsService.createOrUpdateRelation(staffMember.id);

        return staffMember;
    }

    async removeStaffMemberById(id: number) {
        const result = await this.staffRepository.delete(id);
        if (!result.affected) {
            throw new NotFoundException(`Staff member with ID '${id}' was not found`);
        }

        return { message: `Staff member with ID '${id}' successfully deleted` };
    }

    async getSubordinates(staffMemberId: number, subordinatesDepthLevel: SubordinatesDepthLevel): Promise<StaffMember[]> {
        if (subordinatesDepthLevel === SubordinatesDepthLevel.Zero) {
            return [];
        }

        const subordinates = await this.staffRepository.find({
            relations: {
                staffRelation: true
            },
            where: {
                staffRelation: subordinatesDepthLevel === SubordinatesDepthLevel.Any ? {
                    path: Like((await this.staffRelationsService.findRelationByStaffMemberId(staffMemberId)).path + '/%')
                } : {
                    supervisorId: staffMemberId
                }
            }
        })

        return subordinates;
    }
}
