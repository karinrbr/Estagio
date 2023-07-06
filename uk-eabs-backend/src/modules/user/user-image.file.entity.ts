import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { MyBaseEntity } from '../../shared/infra/postgres/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity('user_image_file')
export class UserImage extends MyBaseEntity {
  @ApiProperty({ example: 'my-image.png' })
  @Column({ type: 'text', nullable: false })
  originalName: string;

  @ApiProperty({ example: [] })
  @Column({ type: 'bytea', nullable: false })
  buffer: Buffer;

  @ApiProperty({ example: '2937' })
  @Column({ type: 'integer', unsigned: true, nullable: false })
  size: number;

  @ApiProperty({ example: '7bit' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  encoding: string;

  // https://stackoverflow.com/questions/643690/maximum-mimetype-length-when-storing-type-in-db
  @ApiProperty({ example: 'image/png' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  mimeType: string;

  @ApiProperty({ type: User, required: true })
  @OneToOne(() => User, {
    eager: false,
    nullable: false,
  })
  user: User;

  constructor({ originalName = '', buffer = null, size = 0, encoding = '', mimeType = '' } = {}) {
    super();
    this.originalName = originalName;
    this.buffer = buffer;
    this.size = size;
    this.encoding = encoding;
    this.mimeType = mimeType;
  }

  // https://github.com/typeorm/typeorm/issues/535#issuecomment-662471151
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  toJSON(): UserImage {
    if (!this.user) delete this.user;
    delete this.buffer;
    return this;
  }
}
