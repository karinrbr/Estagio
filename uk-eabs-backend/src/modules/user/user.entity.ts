import { Entity, Column, Index, OneToMany, ManyToOne, OneToOne, JoinColumn, Unique } from 'typeorm';
import { MyBaseEntity } from '../../shared/infra/postgres/base.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Role, Status } from './user.constant';
import { UserImage } from './user-image.file.entity';
import { Board } from '../board/board.entity';
import { Schedule } from '../schedule/schedule.entity';
import { Invoice } from '../invoice/invoice.entity';

@Entity('user')
@Unique('user_unique', ['email'])
export class User extends MyBaseEntity {
  @ApiHideProperty()
  @Column({ type: 'uuid', nullable: true })
  resetPasswordToken?: string;

  @ApiHideProperty()
  @Column({ type: 'text', nullable: true })
  refreshToken?: string;

  @ApiProperty({ example: 'john@doe.com', required: false })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 300, nullable: true })
  email: string;

  //   @ApiProperty({ example: '123456789123456', required: false })
  //   @Index({ unique: true })
  //   @Column({ type: 'varchar', length: 120, nullable: true })
  //   facebookId: string;

  //   @ApiProperty({ example: '123456789123456', required: false })
  //   @Index({ unique: true })
  //   @Column({ type: 'varchar', length: 120, nullable: true })
  //   linkedinId: string;

  @ApiProperty({ example: 'secret', required: false })
  @Column({ type: 'varchar', length: 120, nullable: true, select: false })
  password: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @Column({ type: 'varchar', length: 120, nullable: true })
  name: string;

  @ApiProperty({ example: '1970-01-02', required: false })
  @Column({ type: 'date', nullable: true })
  birthdate: Date;

  // TODO validate using E.164 standard
  @ApiProperty({ example: '+351912345678', required: false })
  @Column({ type: 'varchar', length: 15, nullable: true })
  phone: string;

  @ApiProperty({ example: 'Street Somewhere, Nº 12345', required: false })
  @Column({ type: 'varchar', length: 120, nullable: true })
  address: string;

  @ApiProperty({ example: Role.agent, required: false })
  @Column({ type: 'enum', enum: Role, nullable: true })
  role: Role;

  @ApiProperty({ example: '', required: false })
  @Column({ type: 'varchar', length: 1024, nullable: true })
  description: string;

  @ApiProperty({ example: 'PT123456789', required: false })
  @Column({ type: 'varchar', length: 50, nullable: true })
  vatNumber: string;

  @ApiHideProperty()
  @OneToMany(() => Board, (board) => board.createdBy, { eager: false, persistence: false, nullable: true })
  requestedBoards: Board[];

  @ApiHideProperty()
  @OneToMany(() => Board, (board) => board.schedule, { eager: false, persistence: false, nullable: true })
  scheduledBoards: Board[];

  @ApiHideProperty()
  @OneToMany(() => Schedule, (schedule) => schedule.worker, { eager: false, persistence: false, nullable: true })
  scheduleWorks: Schedule[];

  @ApiHideProperty()
  @OneToMany(() => Invoice, (invoice) => invoice.buyer, { eager: false, persistence: false, nullable: true })
  buyerInvoices: Invoice[];

  //   @ApiHideProperty()
  //   // @ApiProperty({ type: [BusinessProposal], required: false })
  //   @OneToMany(() => BusinessProposal, (proposal) => proposal.buyer, { eager: false })
  //   buyerProposals: BusinessProposal[];

  constructor({
    name = '',
    email = '',
    password = null,
    birthdate = null,
    phone = null,
    address = null,
    role = null,
    description = null,
    vatNumber = null,
    requestedBoards = null,
    scheduledBoards = null,
    scheduleWorks = null,
    buyerInvoices = null
  } = {}) {
    super();
    this.name = name;
    this.email = email;
    this.password = password;
    this.birthdate = birthdate;
    this.phone = phone;
    this.address = address;
    this.role = role;
    this.description = description;
    this.vatNumber = vatNumber;
    this.requestedBoards = requestedBoards;
    this.scheduledBoards = scheduledBoards;
    this.scheduleWorks = scheduleWorks;
    this.buyerInvoices = buyerInvoices;
  }

  // https://github.com/typeorm/typeorm/issues/535#issuecomment-662471151
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  toJSON(): User {
    // if (!this.userImage) delete this.userImage;
    // if (!this.sellerProposals) delete this.sellerProposals;
    // if (!this.buyerProposals) delete this.buyerProposals;
    delete this.resetPasswordToken;
    delete this.refreshToken;
    delete this.password;
    // delete this['__curriculumVitae__'];
    // delete this['__has_curriculumVitae__'];
    // delete this['__userImage__'];
    // delete this['__has_userImage__'];
    return this;
  }
}
