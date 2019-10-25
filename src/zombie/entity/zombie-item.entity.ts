import { PrimaryGeneratedColumn, Entity, ManyToOne, Column } from "typeorm";
import { ZombieEntity } from "./zombie.entity";

@Entity('zombie-item')
export class ZombieItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ZombieEntity, zombie => zombie.items, { onDelete: "CASCADE" })
    zombie: ZombieEntity;

    @Column({ type: 'int', nullable: true })
    zombieId?: number | null

    @Column()
    itemId: number;
}