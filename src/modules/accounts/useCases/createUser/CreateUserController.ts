import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserUsecase } from './CreateUserUsecase';

class CreateUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { name, email, password, driver_license } = request.body;

        const createUserUsecase = container.resolve(CreateUserUsecase);

        await createUserUsecase.execute({
            name,
            email,
            password,
            driver_license,
        });

        return response.status(201).send();
    }
}

export { CreateUserController };
