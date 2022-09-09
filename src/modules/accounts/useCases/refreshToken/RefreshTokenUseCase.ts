import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
    sub: string;
    email: string;
}

interface ITokenResponse {
    token: string;
    refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject('UsersTokensRepository')
        private usersTokensRepository: IUsersTokensRepository,
        @inject('DayjsDateProvider')
        private dateProvider: IDateProvider,
    ) {}

    async execute(token: string): Promise<ITokenResponse> {
        const { email, sub } = verify(
            token,
            auth.refresh_token_secret,
        ) as IPayload;

        const user_id = sub;

        const userToken =
            await this.usersTokensRepository.findByUserIdAndRefreshToken(
                user_id,
                token,
            );

        if (!userToken) {
            throw new AppError('Refresh Token does not exist!');
        }

        await this.usersTokensRepository.deleteById(userToken.id);

        const refresh_token = sign({ email }, auth.refresh_token_secret, {
            subject: user_id,
            expiresIn: auth.refresh_token_expires_in,
        });

        const expires_date = this.dateProvider.addDays(30);

        await this.usersTokensRepository.create({
            user_id,
            refresh_token,
            expires_date,
        });

        const newToken = sign({}, auth.token_secret, {
            subject: user_id,
            expiresIn: auth.token_expires_in,
        });

        return {
            token: newToken,
            refresh_token,
        };
    }
}

export { RefreshTokenUseCase };
