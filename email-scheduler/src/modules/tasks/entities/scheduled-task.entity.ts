import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { EmailTemplate } from '../../email-templates/entities/email-template.entity';

export enum TaskStatus {
  PENDING = 'pending', // 待执行
  RUNNING = 'running', // 任务正在运行
  COMPLETED = 'completed', // 任务完成
  FAILED = 'failed', // 任务执行失败
  PAUSED = 'paused', // 任务暂停执行
}

@Entity('scheduled_tasks')
export class ScheduledTask {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  email_template_id: number;

  @ManyToOne(() => EmailTemplate)
  @JoinColumn({ name: 'email_template_id' })
  email_template: EmailTemplate;

  @Column()
  schedule: string; // Cron expression

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_executed_at: Date;
}
