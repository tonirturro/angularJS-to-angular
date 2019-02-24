import * as express from "express";
import { PageFields } from "../../common/model";
import { INewDeviceParams, IUpdateDeviceParams, IUpdateParams, IUpdateResponse } from "../../common/rest";
import { Capabilities } from "../Repository/Capabilities";
import { Data } from "../Repository/Data";

/**
 * Handles the routes to the REST api
 */
export class RestRouter {

    /**
     * The REST api router
     */
    private router: express.Router;

    /**
     * The data layer
     */
    private data: Data;

    /**
     * The device capabilities
     */
    private capabilities: Capabilities;

    /**
     * Initializes a new instance of the RestRouter class.
     */
    constructor(data: Data, capabilities: Capabilities) {
        this.data = data;
        this.capabilities = capabilities;
        this.router = express.Router();

        // Access to the pages repository
        // tslint:disable-next-line:variable-name
        this.router.get("/pages", (_req: express.Request, res: express.Response) => {
            res.json(this.data.getPages());
        });

        // Access to the devices repository
        // tslint:disable-next-line:variable-name
        this.router.get("/devices", (_req: express.Request, res: express.Response) => {
            res.json(this.data.getDevices());
        });

        // Add new page
        this.router.post("/pages/:deviceId", (req: express.Request, res: express.Response) => {
            const selectedDeviceId = parseInt(req.params.deviceId, 10);
            this.data.newPage(selectedDeviceId);
            res.json({ success: true });
        });

        // Add new device
        this.router.put("/devices", (req: express.Request, res: express.Response) => {
            const params = req.body as INewDeviceParams;
            this.data.newDevice(params.name);
            res.json({ success: true });
        });

        // Delete a pagedeviceId
        this.router.delete("/pages/:pageId", (req: express.Request, res: express.Response) => {
            const pageIdToDelete = parseInt(req.params.pageId, 10);
            const result = this.data.deletePage(pageIdToDelete);
            res.json({
                deletedPageId: pageIdToDelete,
                success: result
            });
        });

        // Delete a device
        this.router.delete("/devices/:deviceId", (req: express.Request, res: express.Response) => {
            const deviceIdToDelete = parseInt(req.params.deviceId, 10);
            const result = this.data.deleteDevice(deviceIdToDelete);
            res.json({
                deletedDeviceId: deviceIdToDelete,
                success: result
            });
        });

        // Getting device capabilities
        this.router.get("/deviceOptions/:capability", (req: express.Request, res: express.Response) => {
            const capabilityToQuery = req.params.capability;
            res.json(this.capabilities.getCapabilities(capabilityToQuery));
        });

        // Updating device name
        this.router.put("/devices/name", (req: express.Request, res: express.Response) => {
            const params = req.body as IUpdateDeviceParams;
            const result = this.data.updateDeviceName(params.id, params.newValue);
            res.json({ success: result } as IUpdateResponse);
        });

        // Update page sizes
        this.defineUpdateApi(PageFields.PageSize);

        // Update print quality
        this.defineUpdateApi(PageFields.PrintQuality);

        // Update media type
        this.defineUpdateApi(PageFields.MediaType);

        // Update destination
        this.defineUpdateApi(PageFields.Destination);
    }

    /**
     * Retrieves to router
     */
    get Router(): express.Router {
        return this.router;
    }

    /**
     * Defines the REST Api for field update
     * @param field the field tab to be updated
     */
    private defineUpdateApi(field: string) {
        this.router.put(`/pages/${field}`, (req: express.Request, res: express.Response) => {
            const result = this.processUpdate(field, req);
            res.json(result);
        });
    }

    /**
     * Calls the corresonding update function with the right parameters
     * @param updateFunction is the tag for the update function to be used
     * @param req is the REST request
     */
    private processUpdate(updateFunction: string, req: express.Request): IUpdateResponse {
        let result = true;
        const params = req.body as IUpdateParams;
        const pages = params.pages;

        if (pages) {
            pages.forEach((page) => {
                    switch (updateFunction) {
                        case PageFields.PageSize:
                            result = result && this.data.updatePageSize(page, params.newValue);
                            break;
                        case PageFields.PrintQuality:
                            result = result && this.data.updatePrintQuality(page, params.newValue);
                            break;
                        case PageFields.MediaType:
                            result = result && this.data.updateMediaType(page, params.newValue);
                            break;
                        case PageFields.Destination:
                            result = result && this.data.updateDestination(page, params.newValue);
                            break;
                    }
                });
        } else {
            result = false;
        }

        return { success: result };
    }
}
