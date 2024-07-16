import { BeforeRemove, Check, Column, Entity, getRepository, Like, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { StaffRelation } from "./staff-relation.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

export enum StaffMemberType {
    Employee = 'Employee',
    Sales = 'Sales',
    Manager = 'Manager',
}

@Entity('staff')
@Check(`"type" IN ('Employee', 'Sales', 'Manager')`)
export class StaffMember {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: false })
    type: StaffMemberType;

    @Column({ nullable: false })
    name: string;

    @Column({ type: 'date', nullable: false })
    entranceDate: Date;

    @Column({ type: 'float', default: 15000 })
    baseSalary: number = 15000;

    @OneToOne(() => StaffRelation, relation => relation.staffMember, { cascade: true, nullable: true })
    staffRelation: StaffRelation;

    constructor(id?: number, type?: StaffMemberType, name?: string, entranceDate?: Date) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.entranceDate = entranceDate;
    }
}