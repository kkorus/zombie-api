import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { ZombieEntity } from "./entity/zombie.entity";
import { CreateZombieDto } from "./dto/create-zombie.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm'
import { ItemService } from "../item/item.service";
import { TotalValueDto } from "../item/dto/totalvalue.dto";
import { ZombieItemEntity } from "./entity/zombie-item.entity";
import { ItemDto } from "../item/dto/item.dto";

@Injectable()
export class ZombieService {
    constructor(
        @InjectRepository(ZombieEntity) private readonly zombieRepository: Repository<ZombieEntity>,
        @InjectRepository(ZombieItemEntity) private readonly zombieItemRepository: Repository<ZombieItemEntity>,
        private readonly itemService: ItemService
    ) { }

    getZombies(): Promise<ZombieEntity[]> {
        return this.zombieRepository.find();
    }

    getZombie(zombieId: number): Promise<ZombieEntity> {
        return this.zombieRepository.findOne({ id: zombieId });
    }

    async createZombie(zombieData: CreateZombieDto): Promise<ZombieEntity> {
        const zombie = new ZombieEntity();
        zombie.name = zombieData.name;
        zombie.items = [];

        const newZombie = await this.zombieRepository.save(zombie);
        return newZombie
    }

    delete(zombieId: number): Promise<DeleteResult> {
        return this.zombieRepository.delete({ id: zombieId });
    }

    async createItem(zombieId: number, itemId: number) {
        const zombie = await this.zombieRepository.findOne({ id: zombieId });
        if (!zombie) {
            return;
        }

        if (zombie.items.length >= 5) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Zombie can not have more than 5 items',
            }, 400);
        }
        const zombieItem = new ZombieItemEntity();
        zombieItem.zombie = zombie;
        zombieItem.itemId = itemId;

        await this.zombieItemRepository.save(zombieItem);
    }

    async getItems(zombieId: number): Promise<ItemDto[]> {
        const zombie = await this.zombieRepository.findOne({ id: zombieId });
        if (!zombie) {
            return [];
        }

        const items = await this.itemService.getItems();
        return zombie && zombie.items.map((item: ZombieItemEntity) => {
            return items.find(i => i.id === item.itemId);
        })
    }

    async deleteItem(zombieId: number, itemId: number) {
        let zombie = await this.zombieRepository.findOne({ id: zombieId });
        const zombieItem = await this.zombieItemRepository.findOne({ id: itemId });
        if (!zombie || !zombieItem) {
            return;
        }

        const deleteIndex = zombie.items.findIndex(i => i.id === zombieItem.id);

        if (deleteIndex >= 0) {
            const deleteItems = zombie.items.splice(deleteIndex, 1);
            await this.zombieItemRepository.delete(deleteItems[0].id);
            zombie = await this.zombieRepository.save(zombie);
            return { zombie };
        } else {
            return { zombie };
        }
    }

    async getItemsTotalValue(zombieId: number): Promise<TotalValueDto[]> {
        const zombieItems = await this.zombieItemRepository.find({ zombieId })
        return await this.itemService.getItemsTotalValue(zombieItems.map(i => i.itemId));
    }
}
