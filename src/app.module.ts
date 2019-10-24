import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZombieModule } from './zombie/zombie.module';
import { Connection } from 'typeorm'
import { ItemModule } from './item/item.module';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        ItemModule,
        ZombieModule,
        SharedModule
    ],
    controllers: [],
    providers: [],
})
export class ApplicationModule {
    constructor(private readonly connection: Connection) { }
}


