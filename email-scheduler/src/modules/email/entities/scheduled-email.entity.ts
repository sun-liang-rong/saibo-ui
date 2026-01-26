import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * 邮件发送状态枚举
 *
 * 设计说明：
 * - PENDING: 待发送，任务已创建，等待发送
 * - SENT: 已发送，邮件成功发送
 * - FAILED: 发送失败，邮件发送失败
 * - RETRYING: 重试中，正在进行重试
 */
export enum EmailStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  RETRYING = 'retrying',
}

/**
 * 调度频率枚举
 *
 * 设计说明：
 * - ONCE: 单次发送
 * - DAILY: 每天发送
 * - WEEKLY: 每周发送
 */
export enum ScheduleFrequency {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

/**
 * 邮件实体
 *
 * 数据库表设计说明：
 * 1. id: 主键，自增
 * 2. to_email: 收件人邮箱，必填，添加索引以便快速查询
 * 3. subject: 邮件标题
 * 4. content: 邮件内容，支持 HTML，使用 TEXT 类型存储较长内容
 * 5. send_time: 定时发送时间，添加索引用于定时任务查询
 * 6. status: 发送状态，枚举类型，默认为 PENDING
 * 7. retry_count: 重试次数，默认为 0
 * 8. error_message: 错误信息，存储发送失败时的错误
 * 9. sent_at: 实际发送时间，可为空
 * 10. created_at: 创建时间，自动记录
 * 11. updated_at: 更新时间，自动记录
 * 12. frequency: 调度频率，单次/每天/每周
 * 13. week_day: 星期几（1-7，仅当 frequency 为 weekly 时有效）
 * 14. parent_id: 父任务 ID，用于关联周期性任务的实例
 * 15. include_weather: 是否包含天气信息
 * 16. weather_city: 天气查询城市
 *
 * 为什么使用 @Index：
 * - send_time: 定时任务每分钟扫描待发送邮件，需要在 send_time 上建立索引
 * - to_email: 可能有按邮箱查询的需求
 * - status: 经常按状态筛选任务
 * - frequency: 支持按调度频率筛选任务
 */
@Entity('scheduled_emails')
@Index(['send_time', 'status']) // 复合索引，用于定时任务查询
export class ScheduledEmail {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  to_email: string;

  @Column({ type: 'varchar', length: 500 })
  subject: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'datetime' })
  send_time: Date;

  @Column({
    type: 'enum',
    enum: EmailStatus,
    default: EmailStatus.PENDING,
  })
  @Index()
  status: EmailStatus;

  @Column({ type: 'int', default: 0 })
  retry_count: number;

  @Column({ type: 'text', nullable: true })
  error_message: string | null;

  @Column({ type: 'datetime', nullable: true })
  sent_at: Date | null;

  @Column({
    type: 'enum',
    enum: ScheduleFrequency,
    default: ScheduleFrequency.ONCE,
  })
  @Index()
  frequency: ScheduleFrequency;

  @Column({ type: 'int', nullable: true })
  week_day: number | null;

  @Column({ type: 'int', nullable: true })
  parent_id: number | null;

  @Column({ type: 'boolean', default: false })
  include_weather: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  weather_city: string | null;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
