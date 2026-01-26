import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * 用户实体
 *
 * 数据库表设计说明：
 * 1. id: 主键，自增
 * 2. username: 用户名，唯一，必填
 * 3. password: 密码（加密存储），必填
 * 4. email: 邮箱，可选
 * 5. is_active: 是否激活，默认 true
 * 6. created_at: 创建时间
 * 7. updated_at: 更新时间
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email: string | null;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
