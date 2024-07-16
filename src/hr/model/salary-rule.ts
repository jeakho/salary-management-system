import { StaffMemberType } from "./staff.entity";


export enum SubordinatesDepthLevel {
    Zero = 0,
    First = 1,
    Any = 2
}

export interface SalaryRule {
    baseSalary: number;
    coefficientPerYear: number;
    coefficientPerSubordinate?: number;
    maxCoefficientOfBaseRate: number;
    subordinatesDepthLevel: SubordinatesDepthLevel;
}

export const staffMemberTypeToSalaryRule = new Map<StaffMemberType, SalaryRule>([
    [ StaffMemberType.Employee, { baseSalary: 15000, coefficientPerYear: 1.03, maxCoefficientOfBaseRate: 1.3, subordinatesDepthLevel: SubordinatesDepthLevel.Zero } ],
    [ StaffMemberType.Manager, { baseSalary: 15000, coefficientPerYear: 1.05, maxCoefficientOfBaseRate: 1.4, coefficientPerSubordinate: 0.005, subordinatesDepthLevel: SubordinatesDepthLevel.First } ],
    [ StaffMemberType.Sales, { baseSalary: 15000, coefficientPerYear: 1.01, maxCoefficientOfBaseRate: 1.35, coefficientPerSubordinate: 0.003, subordinatesDepthLevel: SubordinatesDepthLevel.Any } ],
])