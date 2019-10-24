import { Controller, Inject, Get } from "@nestjs/common";
import { ItemService } from "./item.service";
import { ItemDto } from "./dto/item.dto";
import { RateDto } from "./dto/rate.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('items')
export class ItemController {
    @Inject() itemService: ItemService;

    @ApiOperation({ title: 'Get items' })
    @ApiResponse({ status: 200, description: 'Return items from exchange item' })
    @Get()
    getItems(): Promise<ItemDto[]> {
        return this.itemService.getItems();
    }

    @ApiOperation({ title: 'Get rates' })
    @ApiResponse({ status: 200, description: 'Return exchange rates' })
    @Get()
    getRates(): Promise<RateDto[]> {
        return this.itemService.getRates();
    }
}
