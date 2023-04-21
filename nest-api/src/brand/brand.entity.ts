import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, instanceToPlain } from 'class-transformer';

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

  @Exclude()
  @Column({ length: 100, nullable: true })
  password?: string;

  @Column({ length: 200, nullable: true })
  sub_domain?: string;

  @Column({ default: true })
  write_permission: boolean;

  @Column({ default: true })
  delete_permission: boolean;

  constructor(partial: Partial<Brand>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
