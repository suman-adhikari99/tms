import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn, OneToMany } from 'typeorm';

@Entity({ name: 'employeeWork' })
export class EmployeeWork {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  employeeId: string;

  @Column()
  projectId: string;

  @Column()
  taskId: string;

  @Column()
  priority: string;

  @Column()
  createdDate: string;

  @Column()
  dueDate: string;

  @Column()
  taskTitle: string;

  @Column()
  taskType: string;

  @Column()
  userId: string;

  @Column()
  fullName: string;

  @Column()
  image: string;

  @Column()
  employeeType: string;

  @Column()
  role: string;

  @Column()
  paidTasks: string;

  @Column()
  payPerWord: string;

  @Column()
  numberOfWords: string;

  // @Column()
  // netPayment: string;

  @Column()
  status: string;

  // @Column()
  // payPerUnit: string;

  @Column()
  amount: number;

  @Column()
  totalAmount: string;

  @Column()
  assignedtask: string;

  @Column()
  completedTask: string;

  @Column()
  pendingTask: string;
}
