import { Entity, Column, Index, OneToMany, ManyToOne, OneToOne, JoinColumn, Unique } from 'typeorm';
import { MyBaseEntity } from '../../shared/infra/postgres/base.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
// import { ReadSign, LatLng, ScheduleStatus, WorkSign } from './schedule.constant';
import { User } from '../user/user.entity';
import { Board } from '../board/board.entity';

@Entity('schedule')
export class Schedule extends MyBaseEntity {
  @Column({ type: 'date', nullable: false })
  scheduleAt: Date;

  @ManyToOne(() => User, (user) => user.scheduleWorks, { eager: false, persistence: true, nullable: false })
  worker: User;

  @OneToMany(() => Board, (board) => board.schedule, { eager: false, persistence: true, nullable: false })
  boards: Board[];

  constructor({ scheduleAt = null, worker = null, boards = null } = {}) {
    super();
    this.scheduleAt = scheduleAt;
    this.worker = worker;
    this.boards = boards;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  toJSON(): Schedule {
    return this;
  }
}

export class ScheduleDTO {
  @ApiProperty({ example: '2023-03-10', required: true })
  scheduleAt: Date;

  @ApiProperty({ type: 'string', example: 'user-uuid', required: true })
  worker: string;

  @ApiProperty({ example: ['board-uuid'], required: true })
  boards: string[];
}
