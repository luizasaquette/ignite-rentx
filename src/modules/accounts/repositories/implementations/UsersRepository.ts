import { getRepository, Repository } from "typeorm";

import { IUsersRepository } from "../IUsersRepository";

import { User } from "../../entities/User";

import { ICreateUserDTO } from "../../dtos/ICreateUserDTO"

class UsersRepository implements IUsersRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }

    async create({ name, username, email, password, driver_license }: ICreateUserDTO): Promise<void> {
        const user = this.repository.create({
            name,
            username,
            email,
            password,
            driver_license
        });

        await this.repository.save(user);
    }
}

export { UsersRepository }

