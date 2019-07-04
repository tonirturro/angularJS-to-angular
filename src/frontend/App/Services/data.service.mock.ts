import { Observable, of } from "rxjs";
import { IDevice, IPage, ISelectableOption } from "../../../common/rest";
import { IDataService } from "./definitions";

// tslint:disable-next-line: no-empty
const NOOP = () => {};

export class DataServiceMock implements IDataService {
    public get pages(): IPage[] {
        return [];
    }
    public get devices(): IDevice[] {
        return [];
    }
    public getCapabilities(capability: string): Observable<ISelectableOption[]> {
        return of([]);
    }
    public addNewPage(deviceId: number) {
        NOOP();
    }
    public addNewDevice(name: string) {
        NOOP();
    }
    public deletePage(idToDelete: number) {
        NOOP();
    }
    public deleteDevice(idToDelete: number) {
        NOOP();
    }
    public updateDeviceName(id: number, newValue: string) {
        NOOP();
    }
    public updatePageField(field: string, pages: number[], newValue: string) {
        NOOP();
    }
}
