import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { UserTokens } from '@modules/accounts/infra/typeorm/entities/UserTokens';

import { IUsersTokensRepository } from '../IUsersTokensRepository';

class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
    usersTokens: UserTokens[] = [];

    async create({
        user_id,
        refresh_token,
        expires_date,
    }: ICreateUserTokenDTO): Promise<UserTokens> {
        const userToken = new UserTokens();

        Object.assign(userToken, {
            expires_date,
            refresh_token,
            user_id,
        });

        this.usersTokens.push(userToken);

        return userToken;
    }

    async findByUserIdAndRefreshToken(
        user_id: string,
        token: string,
    ): Promise<UserTokens> {
        const userToken = this.usersTokens.find(
            ut => ut.user_id === user_id && ut.refresh_token === token,
        );

        return userToken;
    }

    async deleteById(id: string): Promise<void> {
        const userToken = this.usersTokens.find(ut => ut.id === id);

        const index = this.usersTokens.indexOf(userToken);

        this.usersTokens.splice(index, 1);
    }

    async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
        const userToken = this.usersTokens.find(
            ut => ut.refresh_token === refresh_token,
        );

        return userToken;
    }
}

export { UsersTokensRepositoryInMemory };
