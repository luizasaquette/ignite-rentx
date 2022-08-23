import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

describe('List Cars', () => {
    let carsRepositoryInMemory: CarsRepositoryInMemory;
    let listAvailableCarsUseCase: ListAvailableCarsUseCase;

    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        listAvailableCarsUseCase = new ListAvailableCarsUseCase(
            carsRepositoryInMemory,
        );
    });

    it('should be able to list all available cars', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'Car 1',
            description: 'Car description',
            license_plate: 'ABC-1234',
            daily_rate: 100,
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category_id',
        });

        const cars = await listAvailableCarsUseCase.execute({});

        expect(cars).toEqual([car]);
    });

    it('should be able to list all available cars by brand', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'Car 2',
            description: 'Car description',
            license_plate: 'DEF-1234',
            daily_rate: 100,
            fine_amount: 60,
            brand: 'Car_brand_test',
            category_id: 'category_id',
        });

        const cars = await listAvailableCarsUseCase.execute({
            brand: 'Car_brand_test',
        });

        expect(cars).toEqual([car]);
    });
    it('shoul be able to list all available cars by name', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'Car 3',
            description: 'Car description',
            license_plate: 'DEF-1235',
            daily_rate: 100,
            fine_amount: 60,
            brand: 'Car_brand_test',
            category_id: 'category_id',
        });

        const cars = await listAvailableCarsUseCase.execute({ name: 'Car 3' });

        expect(cars).toEqual([car]);
    });

    it('shoul be able to list all available cars by category_id', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'Car 4',
            description: 'Car description',
            license_plate: 'DEF-123',
            daily_rate: 100,
            fine_amount: 60,
            brand: 'Car_brand_test',
            category_id: '12345',
        });

        const cars = await listAvailableCarsUseCase.execute({
            category_id: '12345',
        });

        expect(cars).toEqual([car]);
    });
});
