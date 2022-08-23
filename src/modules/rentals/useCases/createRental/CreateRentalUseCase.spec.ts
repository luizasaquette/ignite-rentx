import dayjs from 'dayjs';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

describe('Create Rental', () => {
    let createRentalUseCase: CreateRentalUseCase;
    let dayjsDateProvider: DayjsDateProvider;
    let carsRepositoryInMemory: CarsRepositoryInMemory;
    let rentalsRepositoryInMemory: RentalsRepositoryInMemory;

    const dayAdd24Hours = dayjs().add(1, 'day').toDate();

    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        dayjsDateProvider = new DayjsDateProvider();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dayjsDateProvider,
            carsRepositoryInMemory,
        );
    });

    it('should be able to create a new rental', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'Car name',
            description: 'Car description',
            daily_rate: 100,
            license_plate: 'ABC-1234',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });

        const rental = await createRentalUseCase.execute({
            car_id: car.id,
            user_id: '1234',
            expected_return_date: dayAdd24Hours,
        });

        const rentedCar = await carsRepositoryInMemory.findById(rental.car_id);

        expect(rental).toHaveProperty('id');
        expect(rental).toHaveProperty('start_date');
        expect(rentedCar.available).toBe(false);
    });

    it('should not be able to create a new rental if there is another opened to the user', async () => {
        await rentalsRepositoryInMemory.create({
            car_id: '121212',
            user_id: '1234',
            expected_return_date: dayAdd24Hours,
        });

        await expect(
            createRentalUseCase.execute({
                car_id: '131313',
                user_id: '1234',
                expected_return_date: dayAdd24Hours,
            }),
        ).rejects.toEqual(
            new AppError("There's a rental in progress for user!"),
        );
    });
    it('should not be able to create a new rental if there is another opened to the car', async () => {
        await rentalsRepositoryInMemory.create({
            car_id: '121212',
            user_id: '1234',
            expected_return_date: dayAdd24Hours,
        });

        await expect(
            createRentalUseCase.execute({
                car_id: '121212',
                user_id: '5678',
                expected_return_date: dayAdd24Hours,
            }),
        ).rejects.toEqual(new AppError('Car is already rented!'));
    });
    it('should not be able to create a new rental with invalid expected return time', async () => {
        await expect(
            createRentalUseCase.execute({
                car_id: '121212',
                user_id: '1234',
                expected_return_date: dayjs().toDate(),
            }),
        ).rejects.toEqual(new AppError('Invalid return time!'));
    });
});
