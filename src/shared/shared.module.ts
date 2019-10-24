import { Module } from '@nestjs/common';
import { ClockService } from './clock.service';
import { FetchService } from './fetch.services';

@Module({
    controllers: [],
    providers: [ClockService, FetchService],
    exports: [ClockService, FetchService]
})
export class SharedModule { }

