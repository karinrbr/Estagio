import { ApiProperty } from '@nestjs/swagger';
import { MyBaseEntity } from 'src/shared/infra/postgres/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Board } from '../board/board.entity';
import { User } from '../user/user.entity';

@Entity('invoice')
export class Invoice extends MyBaseEntity {
  @Column({ type: 'date', nullable: false })
  dueAt: Date;

  @Column({ type: 'date', nullable: true })
  paidAt: Date;

  @OneToMany(() => Board, (board) => board.invoice, { eager: true, persistence: true, nullable: false })
  boards: Board[];

  @ManyToOne(() => User, (user) => user.buyerInvoices, { eager: true, persistence: true, nullable: false })
  buyer: User;

  constructor({ dueAt = null, paidAt = null } = {}) {
    super();
    this.dueAt = dueAt;
    this.paidAt = paidAt;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  toJSON(): Invoice {
    return this;
  }
}

export class InvoiceDTO {
  @ApiProperty({ example: '2023-03-31', required: true })
  dueAt: Date;

  @ApiProperty({ example: '2023-03-22', required: false })
  paidAt: Date;

  @ApiProperty({ example: ['board-uuid'], required: true })
  boards: string[];

  @ApiProperty({ type: 'string', example: 'user-uuid', required: true })
  buyer: string;
}
