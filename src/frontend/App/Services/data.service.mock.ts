import * as angular from "angular";
import { IDevice, IPage, ISelectableOption } from "../../../common/rest";
import { IDataService } from "./definitions";

export class DataServiceMock implements IDataService {
    public get pages(): IPage[] {
        return [];
    }
    public get devices(): IDevice[] {
        return [];
    }
    public getCapabilities(capability: string): ISelectableOption[] {
        return [];
    }
    public addNewPage(deviceId: number) {
        angular.noop();
    }
    public addNewDevice(name: string) {
        angular.noop();
    }
    public deletePage(idToDelete: number) {
        angular.noop();
    }
    public deleteDevice(idToDelete: number) {
        angular.noop();
    }
    public updateDeviceName(id: number, newValue: string) {
        angular.noop();
    }
    public updatePageField(field: string, pages: number[], newValue: string) {
        angular.noop();
    }
}
