import { Injectable, NotFoundException } from '@nestjs/common';
import { staffMemberTypeToSalaryRule } from 'src/hr/model/salary-rule';
import { StaffMember, StaffMemberType } from 'src/hr/model/staff.entity';
import { StaffService } from 'src/hr/service/staff.service';

@Injectable()
export class SalaryService {
    private staffMemberToSalaryMap = new Map<number, { salary: number }>();

    constructor(private readonly staffService: StaffService) { }

    clear() {
        this.staffMemberToSalaryMap.clear();
    }

    async computeStaffSalaryAtDate(dateAt: Date): Promise<{ salary: number }> {
        const staff = await this.staffService.findAllStaffMembers();

        return { salary: await this.getWeightedSalaryForStaffMembersAtDate(staff, dateAt) };
    }

    async computeStaffMemberSalaryAtDate(staffMemberId: number, dateAt: Date): Promise<{ salary: number }> {
        if (this.staffMemberToSalaryMap.has(staffMemberId)) {
            return this.staffMemberToSalaryMap.get(staffMemberId);
        }

        const staffMember = await this.staffService.findStaffMemberById(staffMemberId);
        if (!this.isStaffMemberAccepted(staffMember, dateAt)) {
            return { salary: 0 };
        }

        const salaryRule = staffMemberTypeToSalaryRule.get(staffMember.type);

        const fullYearsOfWork = this.computeFullYearsOfWorkAtDate(staffMember, dateAt);
        let salary = salaryRule.baseSalary;
        for (let i = 1; i <= fullYearsOfWork; i++) {
            salary *= salaryRule.coefficientPerYear;
        }

        const subordinates = await this.staffService.getSubordinates(staffMemberId, salaryRule.subordinatesDepthLevel);
        salary += await this.getWeightedSalaryForStaffMembersAtDate(subordinates, dateAt, salaryRule.coefficientPerSubordinate);
        salary = Math.round(Math.min(salary, salaryRule.baseSalary * salaryRule.maxCoefficientOfBaseRate) * 100) / 100;

        this.staffMemberToSalaryMap.set(staffMemberId, { salary });


        return { salary };
    }

    private async getWeightedSalaryForStaffMembersAtDate(staffMembers: StaffMember[], dateAt: Date, weight: number = 1): Promise<number> {
        let salary = 0;
        const fn = async (staffMemberIdx) => {
            if (staffMemberIdx >= staffMembers.length) {
                return;
            }

            salary += weight * (await this.computeStaffMemberSalaryAtDate(staffMembers[staffMemberIdx].id, dateAt)).salary;
            return await fn(++staffMemberIdx)
        };
        await fn(0);
        return salary;
    }

    private isStaffMemberAccepted(staffMember: StaffMember, dateAt: Date) {
        return (new Date(staffMember.entranceDate)).getTime() < dateAt.getTime();
    }


    private computeFullYearsOfWorkAtDate(staffMember: StaffMember, dateAt: Date) {
        const { entranceDate: entranceDateStr } = staffMember;
        const entranceDate = new Date(entranceDateStr);

        if (dateAt.getTime() < entranceDate.getTime()) {
            throw new Error(`Cannot compute salary for the staff member with id '${staffMember.id}' on the specified date`);
        }

        let fullYearsOfWork = dateAt.getFullYear() - entranceDate.getFullYear();
        if (
            dateAt.getMonth() < entranceDate.getMonth() ||
            (dateAt.getMonth() === entranceDate.getMonth() && dateAt.getDate() < entranceDate.getDate())
        ) {
            fullYearsOfWork--;
        }

        return fullYearsOfWork;
    }
}
