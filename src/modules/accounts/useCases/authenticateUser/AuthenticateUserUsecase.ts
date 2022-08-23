import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: {
        name: string;
        email: string;
    };
    token: string;
    refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('UsersTokensRepository')
        private usersTokensRepository: IUsersTokensRepository,
        @inject('DayjsDateProvider')
        private dateProvider: IDateProvider,
    ) {}
    async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);
        const {
            token_secret,
            token_expires_in,
            refresh_token_secret,
            refresh_token_expires_in,
        } = auth;

        if (!user) {
            throw new AppError('E-mail or password incorrect!', 401);
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new AppError('E-mail or password incorrect!', 401);
        }

        const token = sign({}, token_secret, {
            subject: user.id,
            expiresIn: token_expires_in,
        });

        const refresh_token = sign({ email }, refresh_token_secret, {
            subject: user.id,
            expiresIn: refresh_token_expires_in,
        });

        const refresh_token_expires_date = this.dateProvider.addDays(30);

        await this.usersTokensRepository.create({
            user_id: user.id,
            refresh_token,
            expires_date: refresh_token_expires_date,
        });

        const tokenReturn: IResponse = {
            token,
            user: {
                name: user.name,
                email: user.email,
            },
            refresh_token,
        };

        return tokenReturn;
    }
}

export { AuthenticateUserUseCase };
