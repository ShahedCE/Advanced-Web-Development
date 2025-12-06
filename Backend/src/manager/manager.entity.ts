import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { AdminInfo } from 'src/admin/admin.entity';

@Entity('managerinfo')
export class ManagerInfo {
  @PrimaryGeneratedColumn({name : 'manager_id'})
  id: number;

  @Column()
  fullname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  profile_picture: string;

   @CreateDateColumn()
  created_at: Date;


  @Column({ type: 'enum', enum: ['active', 'inactive', 'suspended'], default: 'active' })
  status: string;

  @ManyToOne(() => AdminInfo, admin => admin.managers, {
    onDelete: 'CASCADE',  
  })
 @JoinColumn({ name: 'admin_id' })
  admin: AdminInfo;


 

}
