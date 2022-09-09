import { inject, injectable } from 'tsyringe';

import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider';

interface IRequest {
    car_id: string;
    images_names: string[];
}

@injectable()
class UploadCarImagesUseCase {
    constructor(
        @inject('CarsImagesRepository')
        private carsImagesRepository: ICarsImagesRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    async execute({ car_id, images_names }: IRequest): Promise<void> {
        await Promise.all(
            images_names.map(async image => {
                this.carsImagesRepository.create(car_id, image);
                this.storageProvider.save(image, 'cars');
            }),
        );
    }
}

export { UploadCarImagesUseCase };
