export interface IUpdateParams {
    pages: number[];
    newValue: string;
}

export interface IUpdateDeviceParams {
    id: number;
    newValue: string;
}

export interface IUpdateResponse {
    success: boolean;
}

export interface IPage {
    id: number,
    deviceId: number,
    pageSize: string,
    printQuality: string,
    mediaType: string,
    destination: string
}

export interface ISelectableOption {
    value: string;
    label: string;
}

export interface IDeletePageResponse {
    deletedPageId: number;
    success: boolean;
}

export interface IDevice {
    id: number;
    name: string;
}

export interface IDeleteDeviceResponse {
    deletedDeviceId: number;
    success: boolean;
}

export interface INewDeviceParams {
    name: string;
}