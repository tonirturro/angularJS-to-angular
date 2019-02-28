
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

export interface INgTranslateService {
    /**
     * Sets the default language to use as a fallback
     */
    setDefaultLang(lang: string): void;
    /**
     * Gets the default language used
     */
    getDefaultLang(): string;
    /**
     * Changes the lang currently used
     */
    use(lang: string): Observable<any>;
}
