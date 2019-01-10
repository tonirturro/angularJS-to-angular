import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    IDeleteDeviceResponse,
    IDeletePageResponse,
    IDevice,
    IPage,
    ISelectableOption,
    IUpdateResponse } from "../../../common/rest";
import { IDataService } from "./definitions";

interface ICapabilitiesDictionary {
    [key: string]: ISelectableOption[];
}

interface IGettingCapabilitiesDictionary {
    [key: string]: boolean;
}

@Injectable()
export class Data implements IDataService {

    /**
     * Internal constants
     */
    private readonly REST_URL = "http://localhost:3000/REST";

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
    constructor(private http: HttpClient) { }

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
            }
        });
    }

    /**
     * Request a new device
     */
    public addNewDevice() {
        this.http.put<IUpdateResponse>(this.getUrl("devices"), {}).subscribe((response) => {
            if (response.success) {
                this.updateDevices();
            }
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
            }
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
        });
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
                });
    }
}
