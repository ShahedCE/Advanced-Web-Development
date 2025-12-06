import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { OneToMany } from "typeorm";
import { ManagerInfo } from "src/manager/manager.entity";

@Entity("admininfo")
export class AdminInfo {

@PrimaryGeneratedColumn({ type: 'int', unsigned: true})
id: number;

@Column({ unique:true, type: 'varchar', length:100})
fullname: string;

@Column({type: 'int', unsigned: true})
age: number;

@Column({nullable:true})
password:string;

@Column( { type: 'enum',
          enum: ['active', 'inactive'],
          default: 'active',  
})
status: 'active' | 'inactive';

@Column({length:100, nullable:true})
filepath:string;

@Column({type:'varchar', length:100, nullable:true})
email: string;

@OneToMany(() => ManagerInfo, manager => manager.admin)
managers: ManagerInfo[];
  admin: AdminInfo | PromiseLike<AdminInfo>;


}