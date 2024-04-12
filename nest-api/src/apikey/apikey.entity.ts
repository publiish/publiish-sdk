import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Relation,
} from 'typeorm';
import { Exclude, instanceToPlain } from 'class-transformer';
import { Brand } from '../brand/brand.entity.js';

@Entity('apikeys')
export class Apikey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200, nullable: false, unique: true })
  apikey: string;

  @Column({ default: true })
  isActive: boolean;
  
  @Column({ default: false, nullable: false})
  isDefault: boolean;

  @Column('int', {unsigned: true, nullable: true}) 
  storageSize: number;
  
  @Column({ default: true })
  write_permission: boolean;

  @Column({ default: true })
  delete_permission: boolean;

  @Column()
  brandId: number;

  @ManyToOne(() => Brand, (brand) => brand.apikeys) 
  brand: Relation<Brand>; 
  
  @Column({nullable: true})
  expireAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  constructor(partial: Partial<Apikey>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
