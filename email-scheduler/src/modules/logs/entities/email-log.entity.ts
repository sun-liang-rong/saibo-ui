import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ScheduledTask } from '../../tasks/entities/scheduled-task.entity';

export enum LogStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

@Entity('email_logs')
export class EmailLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  task_id: number;

  @ManyToOne(() => ScheduledTask)
  @JoinColumn({ name: 'task_id' })
  task: ScheduledTask;

  @Column({
    type: 'enum',
    enum: LogStatus,
  })
  status: LogStatus;

  @CreateDateColumn({ type: 'timestamp' })
  sent_at: Date;

  @Column('text', { nullable: true })
  error_msg: string;
}
