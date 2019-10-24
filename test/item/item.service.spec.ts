import { ItemService } from "../../src/item/item.service";
import { ClockService } from "../../src/shared/clock.service";
import { FetchService } from "../../src/shared/fetch.services";
import { Test, TestingModule } from "@nestjs/testing";

describe("ItemService", () => {
    let module: TestingModule;
    let itemService: ItemService;
    let clockService: ClockService;
    let fetchService: FetchService;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                ItemService,
                ClockService,
                FetchService,
            ],
            imports: [],
        }).compile();

        itemService = module.get<ItemService>(ItemService);
        clockService = module.get<ClockService>(ClockService);
        fetchService = module.get<FetchService>(FetchService);
    });

    describe("getItemsTotalValue", () => {
        it("", async () => {
            const items = {
                timestamp: 1500000,
                items: [
                    { id: 1, name: "Sword", price: 100 },
                    { id: 2, name: "Shield", price: 200 },
                    { id: 3, name: "Shoes", price: 300 },
                ]
            };
            const rates = [
                {
                    effectiveDate: "2019-10-24",
                    rates: [
                        { code: "USD", bid: 3, ask: 3 },
                        { code: "EUR", bid: 4, ask: 4 },
                    ]
                }
            ]
            spyOn(fetchService, "fetch").and.returnValues(Promise.resolve(items), Promise.resolve(rates));

            const result = await itemService.getItemsTotalValue([1, 1, 1, 2, 3]);

            expect(result).toEqual(
                [{ code: 'USD', totalPrice: 266.6666666666667 },
                { code: 'EUR', totalPrice: 200 },
                { code: 'PLN', totalPrice: 800 }]);
        });
    });
})