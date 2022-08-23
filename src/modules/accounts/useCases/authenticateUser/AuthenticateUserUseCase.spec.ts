import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateUserUsecase } from '../createUser/CreateUserUsecase';
import { AuthenticateUserUseCase } from './AuthenticateUserUsecase';

describe('Authenticate User', () => {
    let usersRepositoryInMemory: UsersRepositoryInMemory;
    let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
    let dateProvider: DayjsDateProvider;
    let authenticateUserUseCase: AuthenticateUserUseCase;
    let createUserUseCase: CreateUserUsecase;

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemory,
            dateProvider,
        );
        createUserUseCase = new CreateUserUsecase(usersRepositoryInMemory);
    });

    it('should be able to authenticate an user', async () => {
        const user: ICreateUserDTO = {
            driver_license: '000123',
            email: 'user@teste.com',
            password: '1234',
            name: 'User test',
        };

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(result).toHaveProperty('token');
    });

    it('should not be able to authenticate non existing user', async () => {
        await expect(
            authenticateUserUseCase.execute({
                email: 'fake@mail.com',
                password: '1234',
            }),
        ).rejects.toEqual(new AppError('E-mail or password incorrect!', 401));
    });

    it('should not be able to authenticate user with correct password', async () => {
        const user: ICreateUserDTO = {
            driver_license: '000123',
            email: 'user@test.com',
            password: '1234',
            name: 'User test error',
        };

        await createUserUseCase.execute(user);

        await expect(
            authenticateUserUseCase.execute({
                email: 'user@test.com',
                password: 'passwordIncorrect',
            }),
        ).rejects.toEqual(new AppError('E-mail or password incorrect!', 401));
    });
});
