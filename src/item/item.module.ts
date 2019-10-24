import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
    controllers: [ItemController],
    providers: [ItemService],
    exports: [ItemService],
    imports: [SharedModule]
})
export class ItemModule { }

