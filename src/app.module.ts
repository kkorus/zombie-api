import { NedbModule } from '@hungtcs-box/nest-nedb';
import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZombieModule } from './zombie/zombie.module';
import { Connection } from 'typeorm'
import { ItemModule } from './item/item.module';
@Module({
    imports: [
        TypeOrmModule.forRoot(),
        ItemModule,
        ZombieModule
    ],
    controllers: [],
    providers: [],
})
export class ApplicationModule {
    constructor(private readonly connection: Connection) { }
}


