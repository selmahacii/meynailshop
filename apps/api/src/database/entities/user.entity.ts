import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({
    type: 'enum',
    enum: ['client', 'admin'],
    default: 'client',
  })
  role: 'client' | 'admin';

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany('Address', 'user', {
    cascade: true,
    eager: false,
  })
  addresses: any[];

  @OneToMany('Order', 'user', {
    cascade: false,
    eager: false,
  })
  orders: any[];

  @OneToMany('Review', 'user', {
    cascade: false,
    eager: false,
  })
  reviews: any[];

  @OneToMany('WishlistItem', 'user', {
    cascade: true,
    eager: false,
  })
  wishlistItems: any[];
}
