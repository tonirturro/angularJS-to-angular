
import { Observable } from "rxjs";
import { IDevice, IPage, ISelectableOption } from "../../../common/rest";

export interface IDataService {
    pages: IPage[];
    devices: IDevice[];
    getCapabilities: (capability: string) => ISelectableOption[];
    addNewPage: (deviceId: number) => void;
    addNewDevice: (name: string) => void;
    deletePage: (idToDelete: number) => void;
    deleteDevice: (idToDelete: number) => void;
    updateDeviceName: (id: number, newValue: string) => void;
    updatePageField: (field: string, pages: number[], newValue: string) => void;
}
