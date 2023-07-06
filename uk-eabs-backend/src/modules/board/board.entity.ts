import { Entity, Column, Index, OneToMany, ManyToOne, OneToOne, JoinColumn, Unique } from 'typeorm';
import { MyBaseEntity } from '../../shared/infra/postgres/base.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ReadSign, LatLng, ScheduleStatus, WorkSign } from './board.constant';
import { User } from '../user/user.entity';
import { Schedule } from '../schedule/schedule.entity';
import { Invoice } from '../invoice/invoice.entity';

@Entity('board')
export class Board extends MyBaseEntity {
  @ApiProperty({ example: 'H123', required: false })
  @Column({ type: 'varchar', length: 12, nullable: true })
  houseNumber: string;

  @ApiProperty({ example: 'Bristo BS1 3BX', required: true })
  @Column({ type: 'varchar', length: 64, nullable: true })
  city: string;

  @ApiProperty({ example: 'Cabot Circus Glass House', required: true })
  @Column({ type: 'varchar', length: 64, nullable: true })
  address: string;

  @ApiProperty({ example: 'SE21 7AD', required: true })
  @Column({ type: 'varchar', length: 12, nullable: true })
  postalCode: string;

  @ApiProperty({ example: ReadSign.sale, required: true })
  @Column({ type: 'varchar', length: 12, nullable: false })
  readSign: ReadSign;

  @ApiProperty({ example: { lat: 51.53, lng: -0.0969 }, required: true })
  @Column({ type: 'json', nullable: false })
  markerLatLng: LatLng;

  @ApiProperty({ example: 10, required: false })
  @Column({ type: 'int', default: 0, nullable: true })
  numBoards: number;

  @ApiProperty({ example: false, default: false, required: false })
  @Column({ type: 'boolean', default: false, nullable: false })
  isActive: boolean;

  @ApiProperty({ type: 'string', example: 'user-uuid', required: true })
  @ManyToOne(() => User, (user) => user.requestedBoards, { eager: false, persistence: true })
  createdBy: User;

  // @ApiProperty({ example: 'c88ac485-f823-4418-b1dd-e0e66a9af781', required: false })
  // @Column({ type: 'uuid', nullable: true })
  // scheduleId: string;

  // @ApiProperty({ example: new Date(), required: false })
  // @Column({ type: 'timestamptz', default: null, nullable: true })
  // scheduleAt: Date;

  // @ApiProperty({ type: 'string', example: 'user-uuid', required: true })
  // @ManyToOne(() => User, (user) => user.requestedBoards, { eager: false, persistence: true, nullable: true })
  // scheduleTo: User;

  @ApiProperty({ example: ScheduleStatus.pending, required: true })
  @Column({ type: 'varchar', length: 12, nullable: false })
  status: ScheduleStatus;

  @ApiProperty({ example: WorkSign.new, required: true })
  @Column({ type: 'varchar', length: 12, nullable: false })
  workType: WorkSign;

  @ApiProperty({ example: '', required: false })
  @Column({ type: 'varchar', length: 128, nullable: true })
  notes: string;

  @ApiProperty({ type: 'string', example: 'schedule-uuid', required: false })
  @ManyToOne(() => Schedule, (schedule) => schedule.worker, { eager: true, persistence: true, nullable: true })
  schedule: Schedule;

  @ApiProperty({ type: 'string', example: 'invoice-uuid', required: false })
  @ManyToOne(() => Invoice, (invoice) => invoice.boards, { eager: false, persistence: true, nullable: true })
  invoice: Invoice;

  constructor({
    houseNumber = '',
    city = '',
    address = '',
    postalCode = '',
    readSign = null,
    markerLatLng = null,
    numBoards = null,
    isActive = null,
    createdBy = null,
    status = null,
    workType = null,
    notes = '',
    schedule = null,
  } = {}) {
    super();
    this.houseNumber = houseNumber;
    this.city = city;
    this.address = address;
    this.postalCode = postalCode;
    this.readSign = readSign;
    this.markerLatLng = markerLatLng;
    this.numBoards = numBoards;
    this.isActive = isActive;
    this.createdBy = createdBy;
    // this.scheduleId = scheduleId;
    // this.scheduleAt = scheduleAt;
    // this.scheduleTo = scheduleTo;
    this.status = status;
    this.workType = workType;
    this.notes = notes;
    this.schedule = schedule;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  toJSON(): Board {
    return this;
  }
}
