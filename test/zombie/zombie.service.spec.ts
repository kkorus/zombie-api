import { Test } from "@nestjs/testing";
import { TestingModule } from "@nestjs/testing";
import { ZombieService } from "../../src/zombie/zombie.service.";
import { Repository } from "typeorm";
import { ZombieEntity } from "../../src/zombie/entity/zombie.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ItemService } from "../../src/item/item.service";
import { CreateZombieDto } from "../../src/zombie/dto/create-zombie.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ItemDto } from "../../src/item/dto/item.dto";
import { TotalValueDto } from "../../src/item/dto/totalvalue.dto";
import { ClockService } from "../../src/shared/clock.service";
import { FetchService } from "../../src/shared/fetch.services";
import { ZombieItemEntity } from "../../src/zombie/entity/zombie-item.entity";

describe('ZombieService', () => {
    let module: TestingModule;
    let zombieService: ZombieService;
    let itemService: ItemService;
    let repositoryZombie: Repository<ZombieEntity>;
    let repositoryZombieItem: Repository<ZombieItemEntity>;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            providers: [
                ZombieService,
                ItemService,
                ClockService,
                FetchService,
                {
                    provide: getRepositoryToken(ZombieEntity),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(ZombieItemEntity),
                    useClass: Repository,
                }],
            imports: [],
        }).compile();

        repositoryZombie = module.get<Repository<ZombieEntity>>(getRepositoryToken(ZombieEntity));
        repositoryZombieItem = module.get<Repository<ZombieItemEntity>>(getRepositoryToken(ZombieItemEntity));
        zombieService = module.get<ZombieService>(ZombieService);
        itemService = module.get<ItemService>(ItemService);
    });

    describe("getZombies", () => {
        it("should return zombies", async () => {
            const date = new Date();
            const expectedZombies: ZombieEntity[] = [{
                id: 1,
                name: 'Frankie',
                createdAt: date,
                items: []
            },
            {
                id: 2,
                name: 'Mickey',
                createdAt: date,
                items: []
            }];
            spyOn(repositoryZombie, "find").and.returnValue(Promise.resolve(expectedZombies));

            const result = await zombieService.getZombies();

            expect(result).toEqual(expectedZombies);
        });
    });

    describe("getZombie", () => {
        it("should retrun a zombie", async () => {
            const date = new Date();
            const expectedZombie: ZombieEntity = {
                id: 1,
                name: 'Frankie',
                createdAt: date,
                items: []
            };

            spyOn(repositoryZombie, "findOne").and.returnValue(Promise.resolve(expectedZombie));

            const result = await zombieService.getZombie(1);

            expect(result).toEqual(expectedZombie);
        });
    });

    describe("createZombie", () => {
        it("should create a zombie", async () => {
            const zombieData: CreateZombieDto = {
                name: 'Frankie'
            }
            const date = new Date();
            const expectedZombie: ZombieEntity = {
                id: 1,
                name: 'Frankie',
                createdAt: date,
                items: []
            };
            const saveSpy = spyOn(repositoryZombie, "save").and.returnValue(Promise.resolve(expectedZombie));

            const result = await zombieService.createZombie(zombieData);

            expect(result).toEqual(expectedZombie);
            expect(saveSpy).toHaveBeenCalledWith({
                name: 'Frankie',
                items: []
            });
        });
    });

    describe("delete", () => {
        it("should delete a zombie", async () => {
            const deleteSpy = spyOn(repositoryZombie, "delete");

            await zombieService.delete(1);

            expect(deleteSpy).toHaveBeenCalledWith({ id: 1 });
        });
    });

    describe("createItem", () => {
        it("should throw an error it zombies has more than 5 items", () => {
            const expectedError = new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Zombie can not have more than 5 items',
            }, 400);
            const zombie: ZombieEntity = {
                id: 1,
                name: 'Frankie',
                items: <ZombieItemEntity[]>[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
                createdAt: null
            };

            spyOn(repositoryZombie, "findOne").and.returnValue(Promise.resolve(zombie));

            // note: https://github.com/facebook/jest/issues/1700
            // expect(async () => await zombieService.createItem(1,1)).toThrow();
            expect(zombieService.createItem(1, 1)).rejects.toEqual(expectedError)
        });

        it("should create an item", async () => {
            const zombie: ZombieEntity = {
                id: 1,
                name: 'Frankie',
                items: <ZombieItemEntity[]>[{ id: 1 }],
                createdAt: null
            };

            spyOn(repositoryZombie, "findOne").and.returnValue(Promise.resolve(zombie));
            const saveSpy = spyOn(repositoryZombieItem, "save");

            await zombieService.createItem(1, 2);

            expect(saveSpy).toHaveBeenCalledWith({ zombie, itemId: 2 });
        });
    });

    describe("getItems", () => {
        it("should return zombie items", async () => {
            const itemsDto: ItemDto[] = [
                { id: 1, name: "Showrd", price: 100 },
                { id: 2, name: "Shield", price: 200 }
            ];
            const zombie: ZombieEntity = <ZombieEntity>{
                items: [{ itemId: 1 }, { itemId: 2 }]
            }

            spyOn(itemService, "getItems").and.returnValue(Promise.resolve(itemsDto));
            spyOn(repositoryZombie, "findOne").and.returnValue(Promise.resolve(zombie));

            const result = await zombieService.getItems(1);

            expect(result).toEqual(itemsDto);
        });
    });

    describe("getItemsTotalValue", () => {
        it("should return items total value", async () => {
            const zombieItems = <ZombieItemEntity[]>[{ itemId: 1 }, { itemId: 2 }, { itemId: 3 }];
            const expectedResult: TotalValueDto[] = [{
                code: "PLN",
                totalPrice: 100
            }];
            spyOn(repositoryZombieItem, "find").and.returnValue(Promise.resolve(zombieItems));
            const spy = spyOn(itemService, "getItemsTotalValue").and.returnValue(Promise.resolve(expectedResult));

            const result = await zombieService.getItemsTotalValue(1);

            expect(result).toEqual(expectedResult);
            expect(spy).toHaveBeenCalledWith([1, 2, 3]);
        });
    });
});