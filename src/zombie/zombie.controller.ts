import { Controller, Get, Param, Inject, Post, Body, Delete } from '@nestjs/common';
import { ZombieService } from './zombie.service.';
import { CreateZombieDto } from './dto/create-zombie.dto';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller('zombies')
export class ZombieController {
    @Inject() zombieService: ZombieService;

    @ApiOperation({ title: 'Get all zombies' })
    @ApiResponse({ status: 200, description: 'Return all zombies.' })
    @Get()
    getZombies(): Promise<any> {
        return this.zombieService.getZombies();
    }

    @ApiOperation({ title: 'Get zombie' })
    @ApiResponse({ status: 200, description: 'Return zombie by id.' })
    @Get(':id')
    getZombie(@Param('id') id: number) {
        return this.zombieService.getZombie(id);
    }

    @ApiOperation({ title: 'Create zombie' })
    @ApiResponse({ status: 201, description: 'The zombie has been successfully created.' })
    @Post()
    createZombie(@Body() zombieData: CreateZombieDto) {
        return this.zombieService.createZombie(zombieData);
    }

    @ApiOperation({ title: 'Delete zombie' })
    @ApiResponse({ status: 200, description: 'The zombie has been successfully deleted.' })
    @Delete(':id')
    deleteZombie(@Param('id') id: number) {
        return this.zombieService.delete(id);
    }

    @ApiOperation({ title: 'Get zombie items' })
    @ApiResponse({ status: 200, description: 'Return zombie itmes.' })
    @Get(':id/items')
    getItems(@Param('id') id: number) {
        return this.zombieService.getItems(id);
    }

    @ApiOperation({ title: 'Create zombie item' })
    @ApiResponse({ status: 201, description: 'The zombie item has been successfully created.' })
    @Post(':id/items')
    createItem(@Param('id') zombieId: number, @Body('itemId') itemId: number) {
        return this.zombieService.createItem(zombieId, itemId);
    }

    @ApiOperation({ title: 'Delete zombie item' })
    @ApiResponse({ status: 200, description: 'The zombie item has been successfully deleted.' })
    @Delete(':id/items/:itemId')
    deleteItem(@Param() params) {
        return this.zombieService.deleteItem(params.id, params.itemId);
    }

    @ApiOperation({ title: 'Get items total value' })
    @ApiResponse({ status: 200, description: 'Return total value of zombie items.' })
    @Get(':id/items/total-value')
    getItemsTotalValue(@Param('id') id: number) {
        return this.zombieService.getItemsTotalValue(id);
    }
}

