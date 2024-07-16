import { BeforeInsert, BeforeRemove, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { StaffMember } from "./staff.entity";

@Entity('staffRelations')
export class StaffRelation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  staffMemberId: number;

  @Column({ nullable: true })
  supervisorId: number;

  @OneToOne(() => StaffMember, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'staffMemberId' })
  staffMember: StaffMember;

  @ManyToOne(() => StaffMember, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'supervisorId' })
  supervisor: StaffMember;

  @Column({ type: 'text', nullable: false })
  path: string;

  @Column({ type: 'int', nullable: true })
  pathDepth: number;
}