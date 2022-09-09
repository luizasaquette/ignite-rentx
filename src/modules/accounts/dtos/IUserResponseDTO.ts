interface IUserResponseDTO {
    email: string;
    name: string;
    avatar: string;
    driver_license: string;
    id: string;
    avatar_url(): string;
}

export { IUserResponseDTO };
