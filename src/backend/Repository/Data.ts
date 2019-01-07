import { IDevice, IPage } from "../../common/rest";
import { Entities } from "../Model/Entities";

/**
 * Class definition for the repository
 */
export class Data {
    // Track page index
    private lastPageIndex;

    // Track device index
    private lastDeviceIndex;

    // Reference to the data entities from this repository.
    private entities: Entities;

    /**
     * Initializes a new instance of the Data class
     */
    constructor() {
        this.entities = new Entities();
        this.entities.pages = [];
        this.entities.devices = [];
        this.lastPageIndex = 0;
        this.lastDeviceIndex = 0;
    }

    /**
     * Gets the available pages
     */
    public getPages(): IPage[] {
        return this.entities.pages;
    }

    /**
     * Gets the available devices
     */
    public getDevices(): IDevice[] {
        return this.entities.devices;
    }

    /**
     * Adds new page
     */
    public newPage(deviceId: number): void {
        const newPage: IPage = {
            destination: "0",
            deviceId,
            id: this.lastPageIndex++,
            mediaType: "0",
            pageSize: "0",
            printQuality: "0",
        };
        this.entities.pages.push(newPage);
    }

    /**
     * Adds a new device
     */
    public newDevice(): void {
        const newDevice: IDevice = {
            id: this.lastDeviceIndex++,
            name: `Device ${this.lastDeviceIndex}`
        };
        this.entities.devices.push(newDevice);
    }

    /**
     * Deletes an existing page
     * @param idToDelete is the id for the page to be deleted.
     */
    public deletePage(idToDelete: number): boolean {
        const indexToDelete = this.entities.pages.findIndex((p) => p.id === idToDelete);
        if (indexToDelete > -1) {
            this.entities.pages.splice(indexToDelete, 1);
            return true;
        }

        return false;
    }

    /**
     * Deletes an existing device
     * @param idToDelete is the id for the device to be deleted.
     */
    public deleteDevice(idToDelete: number): boolean {
        const indexToDelete = this.entities.devices.findIndex((d) => d.id === idToDelete);

        if (indexToDelete > -1) {
            // Delete the pages
            const pagesToDelete = this.entities.pages.map(
                (p) => {
                    if (p.deviceId === idToDelete) {
                        return p.id;
                    }
                });

            pagesToDelete.forEach((id) => this.deletePage(id));
            // Delete the device
            this.entities.devices.splice(indexToDelete, 1);
            return true;
        }

        return false;
    }

    /**
     * Updates the name for a particular device
     * @param deviceId the id for the device to modify
     * @param newValue the value to set to the previous devive
     */
    public updateDeviceName(deviceId: number, newValue: string): boolean {
        const device = this.entities.devices.find((d) => d.id === deviceId);

        if (device) {
             device.name = newValue;
             return true;
        }

        return false;
    }

    /**
     * Updates the page size for a page
     * @param pageId is the id for the page to be updated
     * @param newValue is the new page size value
     */
    public updatePageSize(pageId: number, newValue: string): boolean {
        const pageToUpdate = this.getPage(pageId);
        if (pageToUpdate != null) {
            pageToUpdate.pageSize = newValue;
            return true;
        }

        return false;
    }

    /**
     * Updates the print quality for a page
     * @param pageId is the id for the page to be updated
     * @param newValue is the new print quality value
     */
    public updatePrintQuality(pageId: number, newValue: string): boolean {
        const pageToUpdate = this.getPage(pageId);
        if (pageToUpdate) {
            pageToUpdate.printQuality = newValue;
            return true;
        }

        return false;
    }

    /**
     * Updates the media type for a page
     * @param pageId is the id for the page to be updated
     * @param newValue is the new media type value
     */
    public updateMediaType(pageId: number, newValue: string): boolean {
        const pageToUpdate = this.getPage(pageId);
        if (pageToUpdate) {
            pageToUpdate.mediaType = newValue;
            return true;
        }

        return false;
    }

    /**
     * Updates the destination for a page
     * @param pageId is the id for the page to be updated
     * @param newValue is the new destination value
     */
    public updateDestination(pageId: number, newValue: string): boolean {
        const pageToUpdate = this.getPage(pageId);
        if (pageToUpdate) {
            pageToUpdate.destination = newValue;
            return true;
        }

        return false;
    }

    /**
     * Finds a page from its id
     * @param pageId is the id for the page to be found
     */
    private getPage(pageId: number): IPage {
        return this.entities.pages.find((p) => p.id === pageId);
    }
}
