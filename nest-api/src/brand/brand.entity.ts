import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { Exclude, instanceToPlain } from 'class-transformer';
import { Apikey } from '../apikey/apikey.entity.js';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {nullable: true, unique: true})
  magic_link_id?: string;
  
  @Column('text', {nullable: true, unique: true})
  did?: string;

  @Column('text', {nullable: true, unique: true})
  public_address?: string;

  @Column({ length: 100, nullable: true })
  brand_name?: string;

  @Column({ length: 200, nullable: true })
  brand_url?: string;

  @Column('int', { nullable: true })
  dao_id?: number;

  @Column({ length: 100, nullable: true, unique: true })
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

  @OneToMany(() => Apikey, (apikey) => apikey.brand)
  apikeys: Relation<Apikey>[];

  constructor(partial: Partial<Brand>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
