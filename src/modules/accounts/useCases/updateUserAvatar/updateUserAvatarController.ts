import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateUserAvatarUseCase } from './updateUserAvatarUsecase';

class UpdateUserAvatarController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: user_id } = request.user;
        const avatar_file = request.file.filename;

        const updateUserAvatarUsecase = container.resolve(
            UpdateUserAvatarUseCase,
        );

        await updateUserAvatarUsecase.execute({ user_id, avatar_file });

        return response.status(204).send();
    }
}

export { UpdateUserAvatarController };
