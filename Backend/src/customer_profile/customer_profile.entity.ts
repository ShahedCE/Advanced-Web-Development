import { Customer } from "src/customer/customer.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

@Entity()
export class Customer_profile {
  @PrimaryGeneratedColumn()
  id: number;


  @Column({ type: 'varchar', nullable: true })
  full_name?: string;

  @Column({ type: 'varchar', nullable: true })
  email?: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: string;

  @Column({ type: 'varchar', nullable: true })
  address?: string;

  @Column({ type: 'varchar', nullable: true })
  gender?: string;

  @Column({ type: 'boolean', nullable: true })
  isActive?: boolean;


  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  
  deletedAt?: Date;

  @OneToOne(() => Customer,(Customer)=> Customer.profile,{onDelete: "CASCADE"})
  @JoinColumn()
  customer: Customer;
}
