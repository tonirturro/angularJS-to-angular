import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    IDeleteDeviceResponse,
    IDeletePageResponse,
    IDevice,
    IPage,
    ISelectableOption,
    IUpdateDeviceParams,
    IUpdateParams,
    IUpdateResponse
} from "../../../common/rest";
import { IDataService } from "./definitions";
import { LogService } from "./log.service";

interface ICapabilitiesDictionary {
    [key: string]: ISelectableOption[];
}

interface IGettingCapabilitiesDictionary {
    [key: string]: boolean;
}

@Injectable()
export class DataService implements IDataService {

    /**
     * Internal constants
     */
    private readonly REST_URL = "http://localhost:3000/REST";
    private readonly httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    /**
     * Internal properties
     */
    private cachedPages: IPage[];
    private defaultCachedPages: IPage[] = [];
    private isGettingPages = false;
    private cachedDevices: IDevice[];
    private defaultCachedDevices: IDevice[] = [];
    private isGettingDevices = false;
    private cachedCapabilities: ICapabilitiesDictionary = {};
    private isGettingCapabilities: IGettingCapabilitiesDictionary = {};
    private defaultCachedCapabilities: ISelectableOption[] = [];

    /**
     * Initializes a new instance from the Data class.
     * @param http the aAngular htt service
     */
    constructor(
        private http: HttpClient,
        private log: LogService) { }

    /**
     * Gets the current cached pages
     */
    public get pages(): IPage[] {
        if (this.cachedPages) {
            return this.cachedPages;
        }

        if (!this.isGettingPages) {
            this.isGettingPages = true;
            this.updatePages();
        }

        return this.defaultCachedPages;
    }

    /**
     * Gets the current cached devices
     */
    public get devices(): IDevice[] {
        if (this.cachedDevices) {
            return this.cachedDevices;
        }

        if (!this.isGettingDevices) {
            this.isGettingDevices = true;
            this.updateDevices();
        }

        return this.defaultCachedDevices;
    }

    /**
     * Get the options available for a particular device capability
     * @param capability the capability to be queried
     */
    public getCapabilities(capability: string): ISelectableOption[] {
        if (this.cachedCapabilities[capability]) {
            return this.cachedCapabilities[capability];
        }

        if (!this.isGettingCapabilities[capability]) {
            this.isGettingCapabilities[capability] = true;
            this.getCapabilitiesFromModel(capability);
        }

        return this.defaultCachedCapabilities;
    }

    /**
     * Request a new page
     */
    public addNewPage(deviceId: number) {
        this.http.post<IUpdateResponse>(`${this.getUrl("pages")}${deviceId}`, {}).subscribe((response) => {
            if (response.success) {
                this.updatePages();
            } else {
                this.log.error(`Error while adding new page to device : ${deviceId}`);
            }
        }, () => {
            this.log.error(`Failure to post ${this.getUrl("pages")}${deviceId}`);
        });
    }

    /**
     * Request a new device
     */
    public addNewDevice() {
        this.http.put<IUpdateResponse>(this.getUrl("devices"), {}).subscribe((response) => {
            if (response.success) {
                this.updateDevices();
            } else {
                this.log.error("Error while adding new device");
            }
        }, () => {
            this.log.error(`Failure to put ${this.getUrl("devices")}`);
        });
    }

    /**
     * Delete an existing page
     * @param idToDelete is the id for the page to be deleted
     */
    public deletePage(idToDelete: number) {
        this.http.delete<IDeletePageResponse>(`${this.getUrl("pages")}${idToDelete}`).subscribe((response) => {
            if (response.success) {
                this.updatePages();
            } else {
                this.log.error(`Error while deleting page id: ${idToDelete}`);
            }
        }, () => {
            this.log.error(`Failure to delete ${this.getUrl("pages")}${idToDelete}`);
        });
    }

    /**
     * Delete an existing device
     * @param idToDelete is the id for the device to be deleted
     */
    public deleteDevice(idToDelete: number) {
        this.http.delete<IDeleteDeviceResponse>(`${this.getUrl("devices")}${idToDelete}`).subscribe((response) => {
            if (response.success) {
                this.updateDevices();
            }
        }, () => {
            this.log.error(`Failure to delete ${this.getUrl("devices")}${idToDelete}`);
        });
    }

    /**
     * Updates the name for a device
     * @param id the id for the device to be updated
     * @param newValue the new value for the update
     */
    public updateDeviceName(id: number, newValue: string) {
        const data: IUpdateDeviceParams = { id, newValue };
        this.http.put<IUpdateResponse>(`${this.getUrl("devices/name")}`, data, this.httpOptions)
            .subscribe((response) => {
                if (response.success) {
                    this.updateDevices();
                } else {
                    this.log.error(`Error while updating device id : ${id}`);
                }
            }, () => {
                this.log.error(`Failure to put ${this.getUrl("devices/name")}`);
            });
    }

    /**
     * Updates a particular field for a set of pages
     * @param field The field to be updated
     * @param pages The pages to be updated
     * @param newValueToSet The new value to be set
     */
    public updatePageField(field: string, pages: number[], newValue: string) {
        this.performUpdate(field, { pages, newValue } as IUpdateParams);
    }

    /**
     * Composes the url for an api
     * @param the api to be composed
     */
    private getUrl(api: string): string {
        return `${this.REST_URL}/${api}/`;
    }

    /**
     * Gets pages from backend
     */
    private updatePages() {
        this.http.get<IPage[]>(this.getUrl("pages")).subscribe((pages) => {
            this.cachedPages = pages;
        },
            () => {
                this.isGettingPages = false;
                this.log.error(`Failure to get ${this.getUrl("pages")}`);
            });
    }

    /**
     * Gets devices from backend
     */
    private updateDevices() {
        this.http.get<IDevice[]>(this.getUrl("devices")).subscribe((devices) => {
            this.cachedDevices = devices;
        },
            () => {
                this.log.error(`Failure to get ${this.getUrl("devices")}`);
                this.isGettingDevices = false;
            });
    }

    /**
     * Query the options available for a particular device capability
     * @param capability the capability to be queried
     */
    private getCapabilitiesFromModel(capability: string) {
        this.http.get<ISelectableOption[]>(`${this.getUrl("deviceOptions")}${capability}`)
            .subscribe((options) => {
                this.cachedCapabilities[capability] = options;
            },
                () => {
                    this.isGettingCapabilities[capability] = false;
                    this.log.error(`Failure to get ${capability} device capability`);
                });
    }

    /**
     * Executes the update for the designated field and with the corresponding parameters
     * @param field is the field to be updated
     * @param params are the params for the update
     */
    private performUpdate(field: string, params: IUpdateParams) {
        this.http.put<IUpdateResponse>(`${this.getUrl("pages")}${field}`, params, this.httpOptions)
            .subscribe((response) => {
                if (response.success) {
                    this.updatePages();
                } else {
                    this.log.error(`Error while updating field ${field} for page id: ${params.pages[0]}`);
                }
            }, () => {
                this.log.error(`Failure to put ${this.getUrl("pages")}${field}`);
            });
    }
}
