import { Customer } from 'src/customer/customer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  service: string;

  @Column()
  date: string;

  @Column()
  time: string;

  // নতুন ফিল্ড যা ফ্রন্টএন্ড থেকে আসতে পারে
  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  instructions: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  totalAmount: number;

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    nullable: true, // লগইন ছাড়া অর্ডার নেওয়ার জন্য true
    onDelete: 'CASCADE',
  })
  customer: Customer;

  @CreateDateColumn()
  createdAt: Date;
}
