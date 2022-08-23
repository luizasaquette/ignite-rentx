import { inject, injectable } from 'tsyringe';

import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository';

interface IRequest {
    car_id: string;
    images_names: string[];
}

@injectable()
class UploadCarImagesUseCase {
    constructor(
        @inject('CarsImagesRepository')
        private carsImagesRepository: ICarsImagesRepository,
    ) {}

    async execute({ car_id, images_names }: IRequest): Promise<void> {
        await Promise.all(
            images_names.map(async image => {
                return this.carsImagesRepository.create(car_id, image);
            }),
        );
    }
}

export { UploadCarImagesUseCase };
