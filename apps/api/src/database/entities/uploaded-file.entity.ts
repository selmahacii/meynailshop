import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('uploaded_files')
export class UploadedFileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  filename: string;

  @Column({ type: 'bytea' })
  data: Buffer;

  @Column({ default: 'image/webp' })
  mimetype: string;

  @CreateDateColumn()
  createdAt: Date;
}
