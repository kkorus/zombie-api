import { Injectable } from "@nestjs/common";
import { ItemDto } from "./dto/item.dto";
import { RateDto } from "./dto/rate.dto";
import { TotalValueDto } from "./dto/totalvalue.dto";
import { ClockService } from "../shared/clock.service";
import { FetchService } from "../shared/fetch.services";

@Injectable()
export class ItemService {
    private timestampItems: number;
    private timestampRates: number;
    private cachedItems: ItemDto[];
    private cachedRates: RateDto[];
    private DayInMs = 24 * 60 * 60 * 1000;
    private currenciesCode = ['USD', 'EUR', 'PLN'];
    private itemsURL = "https://zombie-items-api.herokuapp.com/api/items";
    private ratesURL = "http://api.nbp.pl/api/exchangerates/tables/C/today/";

    constructor(
        private readonly clockService: ClockService,
        private readonly fetchService: FetchService
    ) { }

    async getItems(): Promise<ItemDto[]> {
        const currentTime = this.clockService.getCurrentTime();
        if (!this.timestampItems || this.isDayDiff(currentTime, this.timestampItems)) {
            const result = await this.fetchService.fetch(this.itemsURL);

            this.timestampItems = result.timestamp;
            this.cachedItems = result.items;
            return this.cachedItems;
        }

        return this.cachedItems;
    }

    async getRates(): Promise<RateDto[]> {
        const currentTime = this.clockService.getCurrentTime();
        if (!this.timestampRates || this.isDayDiff(currentTime, this.timestampRates)) {
            const result = await this.fetchService.fetch(this.ratesURL);

            this.timestampRates = new Date(result[0].effectiveDate).getTime();
            this.cachedRates = result[0].rates;
            this.cachedRates.push(<RateDto>{ code: 'PLN', bid: 1, ask: 1 });
            return this.cachedRates;
        }

        return this.cachedRates;
    }

    async getItemsTotalValue(itemsId: number[]): Promise<TotalValueDto[]> {
        const items = await this.getItems();
        const mappedItems = itemsId.map(itemId => {
            return items.find((item: ItemDto) => item.id === itemId)
        });

        const rates = (await this.getRates()).filter(rate => this.currenciesCode.includes(rate.code));
        return rates.map((rate: RateDto) => {
            const avg = (rate.ask + rate.bid) / 2;
            return {
                code: rate.code,
                totalPrice: mappedItems.reduce((prev, cur) => {
                    return prev + (cur.price / avg)
                }, 0)
            }
        });
    }

    private isDayDiff(currentTime: number, timestamp: number): boolean {
        const timeDiff = currentTime - timestamp;
        return timeDiff > this.DayInMs;
    }
}