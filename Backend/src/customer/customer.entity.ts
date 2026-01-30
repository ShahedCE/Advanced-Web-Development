import { Customer_profile } from 'src/customer_profile/customer_profile.entity';
import { Order } from 'src/orders/order.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  full_name?: string;

  @Column({ type: 'varchar', nullable: true})
  email?: string;

  @Column({ type: 'varchar', nullable: false })
  phone: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @OneToOne(
    () => Customer_profile,
    (Customer_profile) => Customer_profile.customer,
    {
      nullable: true,
      cascade: ['insert', 'update', 'remove'], // cascade remove
      //eager: true  // Automatically load profile when fetching customer
    },
  )
  //@JoinColumn()
  profile: Customer_profile | null; // Optional, can be used to link to a profile entity

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date; // Auto-set when row is created

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date; // Auto-updated on row update

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date; // Soft delete timestamp
}
