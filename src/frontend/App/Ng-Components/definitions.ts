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

export interface ILanguageParam {
    language: ELanguages;
}

export interface IDeviceSelection {
    deviceId: number;
}
