import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import { CreateUserController } from '@modules/accounts/useCases/createUser/CreateUserController';
import { ShowUserProfileController } from '@modules/accounts/useCases/showUserProfile/ShowUserProfileController';
import { UpdateUserAvatarController } from '@modules/accounts/useCases/updateUserAvatar/updateUserAvatarController';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';

const usersRoutes = Router();

const uploadAvatar = multer(uploadConfig);

const createUserController = new CreateUserController();
const updateUserAvataController = new UpdateUserAvatarController();
const showUserProfileController = new ShowUserProfileController();

usersRoutes.post('/', createUserController.handle);

usersRoutes.patch(
    '/avatar',
    ensureAuthenticated,
    uploadAvatar.single('avatar'),
    updateUserAvataController.handle,
);

usersRoutes.get(
    '/profile',
    ensureAuthenticated,
    showUserProfileController.handle,
);

export { usersRoutes };
