import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('stock_movements')
@Index(['productId'])
@Index(['createdAt'])
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  productId: string;

  @Column({
    type: 'enum',
    enum: ['in', 'out', 'adjustment', 'sale', 'return'],
  })
  type: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reference: string;

  @Column({ type: 'uuid', nullable: true })
  adminId: string;

  @CreateDateColumn()
  createdAt: Date;
}
