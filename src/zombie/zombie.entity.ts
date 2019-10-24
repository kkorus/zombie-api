import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity('zombie')
export class ZombieEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => ZombieItemEntity, item => item.zombie, { eager: true })
    @JoinColumn()
    items: ZombieItemEntity[]

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;
}

@Entity('zombie-item')
export class ZombieItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ZombieEntity, zombie => zombie.items)
    zombie: ZombieEntity;

    @Column({ type: 'int', nullable: true })
    zombieId?: number | null

    @Column()
    itemId: number;
}