import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { ZombieItemEntity } from './zombie-item.entity';

@Entity('zombie')
export class ZombieEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => ZombieItemEntity, item => item.zombie, { eager: true, onDelete: "CASCADE" })
    @JoinColumn()
    items: ZombieItemEntity[]

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;
}
