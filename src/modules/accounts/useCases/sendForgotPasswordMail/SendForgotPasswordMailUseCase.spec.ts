import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '@shared/errors/AppError';

import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

describe(' Send Forgot Password Mail', () => {
    let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
    let usersRepositoryInMemory: UsersRepositoryInMemory;
    let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
    let dateProvider: DayjsDateProvider;
    let mailProviderInMemory: MailProviderInMemory;

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
        dateProvider = new DayjsDateProvider();
        mailProviderInMemory = new MailProviderInMemory();
        sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemory,
            dateProvider,
            mailProviderInMemory,
        );
    });

    it('should be able to send a forgot password mail to user', async () => {
        await usersRepositoryInMemory.create({
            driver_license: '975931537',
            email: 'dehnotdon@ahute.tc',
            name: 'Fanny Hudson',
            password: '1234',
        });

        const sendMailSpy = jest.spyOn(mailProviderInMemory, 'sendMail');

        await sendForgotPasswordMailUseCase.execute('dehnotdon@ahute.tc');

        expect(sendMailSpy).toHaveBeenCalled();
    });

    it('should not be able to send a forgot password mail if user does not exist', async () => {
        await expect(
            sendForgotPasswordMailUseCase.execute('lokso@iziwuj.ng'),
        ).rejects.toEqual(new AppError('User does not exist!'));
    });

    it('should be able to create an users token', async () => {
        const generateTokenMailSpy = jest.spyOn(
            usersTokensRepositoryInMemory,
            'create',
        );

        await usersRepositoryInMemory.create({
            driver_license: '695642384',
            email: 'jutgoli@musevsa.ir',
            name: 'Trevor Ramsey',
            password: '1234',
        });

        await sendForgotPasswordMailUseCase.execute('jutgoli@musevsa.ir');

        expect(generateTokenMailSpy).toHaveBeenCalled();
    });
});
