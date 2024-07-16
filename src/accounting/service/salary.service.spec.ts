import { Test, TestingModule } from '@nestjs/testing';
import { SalaryService } from './salary.service';
import { StaffService } from 'src/hr/service/staff.service';
import { StaffMember, StaffMemberType } from 'src/hr/model/staff.entity';
import { SubordinatesDepthLevel } from 'src/hr/model/salary-rule';


const companyStaff: StaffMember[] = [
    new StaffMember(1, StaffMemberType.Employee, 'Alex', new Date(2022, 5, 10)),
    new StaffMember(2, StaffMemberType.Employee, 'Sofia', new Date(1900, 5, 10)),
    new StaffMember(3, StaffMemberType.Manager, 'Kate', new Date(2023, 5, 10)),
    new StaffMember(4, StaffMemberType.Sales, 'John', new Date(2020, 5, 10)),
]


describe('SalaryService', () => {
    let salaryService: SalaryService;
    let staffService: StaffService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            SalaryService, {
                provide: StaffService,
                useValue: {
                    findAllStaffMembers: jest.fn(),
                    findStaffMemberById: jest.fn(),
                    getSubordinates: jest.fn()
                }
            }
        ],
        }).compile();

        salaryService = module.get<SalaryService>(SalaryService);
        staffService = module.get<StaffService>(StaffService);
    });

    it('should be defined', () => {
        expect(salaryService).toBeDefined();
    });

    describe('computeStaffMemberSalaryAtDate', () => {
        it('should compute salary for an Employee which should not be greater than the maximum salary', async () => {
            const staffMember = companyStaff[0];

            jest.spyOn(staffService, 'findStaffMemberById').mockReturnValue(Promise.resolve(staffMember));
            jest.spyOn(staffService, 'getSubordinates').mockReturnValue(Promise.resolve([]));

            const result = await salaryService.computeStaffMemberSalaryAtDate(staffMember.id, new Date());
            expect(result).toStrictEqual({ salary: 15913.5 });
        });

        it('should compute salary of a Employee which should be equal to the maximum salary', async () => {
            const staffMember = companyStaff[1];

            jest.spyOn(staffService, 'findStaffMemberById').mockReturnValue(Promise.resolve(staffMember));
            jest.spyOn(staffService, 'getSubordinates').mockReturnValue(Promise.resolve([]));

            const result = await salaryService.computeStaffMemberSalaryAtDate(staffMember.id, new Date());
            expect(result).toStrictEqual({ salary: 19500 });
        });

        it('should give 0 salary of a Employee for the date prior to his entrance to the company', async () => {
            const staffMember = companyStaff[0];

            jest.spyOn(staffService, 'findStaffMemberById').mockReturnValue(Promise.resolve(staffMember));
            jest.spyOn(staffService, 'getSubordinates').mockReturnValue(Promise.resolve([]));

            const result = await salaryService.computeStaffMemberSalaryAtDate(staffMember.id, new Date(2021, 5, 10));
            expect(result).toStrictEqual({ salary: 0 });
        });

        it('should compute salary for a Manager with subordinates', async () => {
            const staffMember = companyStaff[2];

            jest.spyOn(staffService, 'findStaffMemberById').mockImplementation((staffMemberId) => (
                Promise.resolve(companyStaff.find(staffMember => staffMember.id === staffMemberId))
            ));
            jest.spyOn(staffService, 'getSubordinates').mockImplementation((_, subordinatesDepthLevel) => (
                Promise.resolve(
                    subordinatesDepthLevel === SubordinatesDepthLevel.First ?
                        [companyStaff[0], companyStaff[1]] :
                        []
                )
            ));

            const result = await salaryService.computeStaffMemberSalaryAtDate(staffMember.id, new Date());
            expect(result).toStrictEqual({ salary: 15927.07 });
        });

        it('should compute salary for an Sales without subordinates', async () => {
            const staffMember = companyStaff[3];

            jest.spyOn(staffService, 'findStaffMemberById').mockReturnValue(Promise.resolve(staffMember));
            jest.spyOn(staffService, 'getSubordinates').mockReturnValue(Promise.resolve([]));

            const result = await salaryService.computeStaffMemberSalaryAtDate(staffMember.id, new Date());
            expect(result).toStrictEqual({ salary: 15609.06 });
        });
    });

    describe('computeStaffSalaryAtDate', () => {
        it('should compute salary for all staff members', async () => {
            jest.spyOn(staffService, 'findAllStaffMembers').mockReturnValue(Promise.resolve(companyStaff));
            jest.spyOn(staffService, 'findStaffMemberById').mockImplementation((staffMemberId) => (
                Promise.resolve(companyStaff.find(staffMember => staffMember.id === staffMemberId))
            ));
            jest.spyOn(staffService, 'getSubordinates').mockImplementation((staffMemberId, _) => (
                Promise.resolve(staffMemberId === 3 ? [companyStaff[1]] : [])
            ));

            const result = await salaryService.computeStaffSalaryAtDate(new Date());
            expect(result).toStrictEqual({ salary: 66870.06 });
        })
    })
})