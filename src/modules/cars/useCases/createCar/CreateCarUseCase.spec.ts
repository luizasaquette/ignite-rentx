import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from './CreateCarUseCase';

describe('Create Car', () => {
    let carsRepositoryInMemory: ICarsRepository;
    let createCarUseCase: CreateCarUseCase;

    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    });

    it('should be able to create a new car', async () => {
        const car = await createCarUseCase.execute({
            name: 'Car name',
            description: 'Car description',
            daily_rate: 100,
            license_plate: 'ABC-1234',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });

        expect(car).toHaveProperty('id');
    });
    it('should not be able to create a car with existing license_plate', async () => {
        await createCarUseCase.execute({
            name: 'Car 1',
            description: 'Car description',
            daily_rate: 100,
            license_plate: 'ABC-1234',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });

        await expect(
            createCarUseCase.execute({
                name: 'Car 2',
                description: 'Car description',
                daily_rate: 100,
                license_plate: 'ABC-1234',
                fine_amount: 60,
                brand: 'Brand',
                category_id: 'category',
            }),
        ).rejects.toEqual(new AppError('Car already exists!'));
    });

    it('should be able to create a car with available true by default', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'Car',
            description: 'Car description',
            daily_rate: 100,
            license_plate: 'ABC-1234',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });

        expect(car.available).toBe(true);
    });
});
