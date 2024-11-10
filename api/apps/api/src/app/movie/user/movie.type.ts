export class CreateMovie {
    title: string;
    userId: string;
    readonly rating?: number;
}

export class UpdateMovie {
    readonly id: string;
    title?: string;
    rating?: number;
}