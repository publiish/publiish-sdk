import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { instanceToPlain } from 'class-transformer';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  filename: string;

  @Column({ nullable: true })
  new_filename: string;

  @Column({ length: 100 })
  file_type: string;

  @Column({ length: 200 })
  cid: string;

  @Column('int')
  brand_id: number;

  @Column('int')
  consumer_id: number;

  @Column('int')
  created_by: number;

  @Column('int')
  updated_by: number;

  @Column({ nullable: true })
  delete_flag: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
  })
  updated_at: Date;

  constructor(partial: Partial<File>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
