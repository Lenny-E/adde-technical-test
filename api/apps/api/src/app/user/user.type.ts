export class CreateUser {
    readonly email: string;
    readonly username: string;
    password: string;
    role?: string;
}

export class UpdateUser {
    readonly name: string;
    password: string;
}