
import { IDevice, IPage, ISelectableOption } from "../../../common/rest";

export interface IDataService {
    pages: IPage[];
    devices: IDevice[];
    getCapabilities: (capability: string) => ISelectableOption[];
    addNewPage: (deviceId: number) => void;
    addNewDevice: () => void;
    deletePage: (idToDelete: number) => void;
    deleteDevice: (idToDelete: number) => void;
}
