import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { instanceToPlain } from 'class-transformer';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true })
  brand_name?: string;

  @Column({ length: 200, nullable: true })
  brand_url?: string;

  @Column('int', { nullable: true })
  dao_id?: number;

  @Column({ length: 100, nullable: true })
  email?: string;

  @Column({ length: 100, nullable: true })
  password?: string;

  @Column({ default: true })
  write_permission: boolean;

  @Column({ default: true })
  delete_permission: boolean;

  constructor(partial: Partial<File>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
