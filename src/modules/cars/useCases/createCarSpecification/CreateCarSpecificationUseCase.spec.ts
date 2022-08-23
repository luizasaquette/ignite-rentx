import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

describe('Create Car Specification', () => {
    let carsRepositoryInMemory: CarsRepositoryInMemory;
    let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;
    let createCarSpecificationUseCase: CreateCarSpecificationUseCase;

    beforeEach(() => {
        specificationsRepositoryInMemory =
            new SpecificationsRepositoryInMemory();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
            carsRepositoryInMemory,
            specificationsRepositoryInMemory,
        );
    });

    it('should be able to add a new specification to the car', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'Car name',
            description: 'Car description',
            daily_rate: 100,
            license_plate: 'ABC-1234',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });

        const specification = await specificationsRepositoryInMemory.create({
            description: 'Specification description',
            name: 'Specification test',
        });

        const specifications_id = [specification.id];

        const carWithSpecifications =
            await createCarSpecificationUseCase.execute({
                car_id: car.id,
                specifications_id,
            });

        expect(carWithSpecifications).toHaveProperty('specifications');
        expect(carWithSpecifications.specifications.length).toBe(1);
    });

    it('should not be able to add a new specification to a non existing car', async () => {
        const car_id = '1234';
        const specifications_id = ['1234'];

        await expect(
            createCarSpecificationUseCase.execute({
                car_id,
                specifications_id,
            }),
        ).rejects.toEqual(new AppError('Cars does not exists!'));
    });
});
