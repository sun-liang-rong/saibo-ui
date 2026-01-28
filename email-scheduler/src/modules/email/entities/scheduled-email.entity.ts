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
 * - HOURLY: 每小时发送 (新增)
 * - DAILY: 每天发送
 * - WEEKLY: 每周发送
 * - ANNIVERSARY: 纪念日发送 (新增)
 */
export enum ScheduleFrequency {
  ONCE = 'once',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  ANNIVERSARY = 'anniversary',
}

/**
 * 邮件规则与发送记录实体
 *
 * 核心设计思想：
 * - 一条记录既是规则定义，也是发送历史记录
 * - 通过 is_rule 字段区分是规则还是实例
 * - 规则 (is_rule=true): 定义何时发送，存储发送配置
 * - 实例 (is_rule=false): 记录实际发送历史，parent_id 指向规则
 *
 * 数据库表设计说明：
 * 1. id: 主键，自增
 * 2. to_email: 收件人邮箱，必填，添加索引以便快速查询
 * 3. subject: 邮件标题
 * 4. content: 邮件内容，支持 HTML，使用 TEXT 类型存储较长内容
 * 5. send_time: 发送时间配置 (规则存配置时间，实例存实际发送时间)
 * 6. status: 发送状态，枚举类型，默认为 PENDING
 * 7. retry_count: 重试次数，默认为 0
 * 8. error_message: 错误信息，存储发送失败时的错误
 * 9. sent_at: 实际发送时间 (仅实例使用)
 * 10. created_at: 创建时间，自动记录
 * 11. updated_at: 更新时间，自动记录
 * 12. frequency: 调度频率，单次/每小时/每天/每周/纪念日
 * 13. week_day: 星期几（1-7，仅当 frequency 为 weekly 时有效）
 * 14. parent_id: 父规则 ID (实例指向规则，规则为 null)
 * 15. is_rule: 规则标识 (true=规则，false=实例)
 * 16. last_sent_at: 最后发送时间 (仅规则使用，防重复发送)
 * 17. next_send_at: 下次预计发送时间 (仅规则使用，优化查询)
 * 18. anniversary_month: 纪念日月份 (1-12，仅 anniversary 频率使用)
 * 19. anniversary_day: 纪念日日期 (1-31，仅 anniversary 频率使用)
 * 20. include_weather: 是否包含天气信息
 * 21. weather_city: 天气查询城市
 * 22. template_category: 模板分类 (如: greeting, birthday, reminder 等)
 * 23. template_id: 模板ID (用于标识使用了哪个模板)
 *
 * 字段语义说明：
 * - 规则记录 (is_rule=true):
 *   parent_id = null, send_time = 配置时间, sent_at = null
 *   last_sent_at = 最后触发时间, next_send_at = 下次计算时间
 * - 实例记录 (is_rule=false):
 *   parent_id = 规则ID, send_time = 实际发送时间, sent_at = 发送时间戳
 *   last_sent_at = null, next_send_at = null
 *
 * 为什么使用 @Index：
 * - send_time: 定时任务每分钟扫描待发送邮件，需要在 send_time 上建立索引
 * - to_email: 可能有按邮箱查询的需求
 * - status: 经常按状态筛选任务
 * - frequency: 支持按调度频率筛选任务
 * - is_rule: 区分规则和实例的查询
 * - last_sent_at: 防重复发送查询
 * - next_send_at: 优化下次发送时间查询
 * - template_category: 支持按模板分类筛选
 * - template_id: 支持按模板ID查询
 */
@Entity('scheduled_emails')
@Index(['send_time', 'status']) // 复合索引，用于定时任务查询
@Index(['is_rule']) // 规则标识索引
@Index(['parent_id', 'is_rule']) // 规则-实例关联索引
@Index(['last_sent_at']) // 最后发送时间索引
@Index(['next_send_at']) // 下次发送时间索引
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

  /**
   * 规则标识: true=规则，false=实例
   */
  @Column({ type: 'boolean', default: true })
  @Index()
  is_rule: boolean;

  /**
   * 最后发送时间 (仅规则使用，用于防重复发送)
   */
  @Column({ type: 'datetime', nullable: true })
  @Index()
  last_sent_at: Date | null;

  /**
   * 下次预计发送时间 (仅规则使用，用于优化查询)
   */
  @Column({ type: 'datetime', nullable: true })
  @Index()
  next_send_at: Date | null;

  /**
   * 纪念日月份 (1-12，仅 anniversary 频率使用)
   */
  @Column({ type: 'int', nullable: true })
  anniversary_month: number | null;

  /**
   * 纪念日日期 (1-31，仅 anniversary 频率使用)
   */
  @Column({ type: 'int', nullable: true })
  anniversary_day: number | null;

  @Column({ type: 'boolean', default: false })
  include_weather: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  weather_city: string | null;

  /**
   * 模板分类 (如: greeting, birthday, reminder 等)
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  @Index()
  template_category: string | null;

  /**
   * 模板ID (用于标识使用了哪个模板)
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  @Index()
  template_id: string | null;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
