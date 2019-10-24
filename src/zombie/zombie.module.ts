import { Module } from '@nestjs/common';
import { ZombieController } from './zombie.controller';
import { ZombieService } from './zombie.service.';
import { ZombieEntity, ZombieItemEntity } from './zombie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemModule } from '../item/item.module';

@Module({
    imports: [TypeOrmModule.forFeature([ZombieEntity, ZombieItemEntity]), ItemModule],
    controllers: [ZombieController],
    providers: [ZombieService],
})
export class ZombieModule { }

