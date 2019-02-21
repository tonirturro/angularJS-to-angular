export enum ELanguages {
    English,
    Klingon
}

export interface IDialogParam<T> {
    params: T;
}

export interface IMessageParam {
    message: string;
}
