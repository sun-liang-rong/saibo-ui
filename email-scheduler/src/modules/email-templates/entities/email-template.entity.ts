import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('email_templates')
export class EmailTemplate {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  subject: string;

  @Column('text', { nullable: true })
  body: string;

  @Column({ name: 'type', default: 'custom' })
  type: string;

  @Column({ name: 'to_email' })
  to_email: string;

  @Column({ name: 'prompt', type: 'text', nullable: true })
  prompt: string;

  @Column({ name: 'use_ai', type: 'boolean', default: false })
  use_ai: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
