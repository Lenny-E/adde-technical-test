export class CreateMovie {
    readonly title: string;
    user_id: string;
    readonly rating?: number;
}

export class UpdateMovie {
    readonly id: string;
    readonly title?: string;
    rating?: number;
}