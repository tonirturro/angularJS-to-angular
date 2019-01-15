import { IComponentController, ILogService, IRootScopeService } from "angular";
import { IDevice } from "../../../common/rest";
import { IStateService } from "../Routes/ui-routes";
import { IDataService } from "../Services/definitions";
import { IIdParam } from "./definitions";

export interface IDeviceSelection {
    deviceId: number;
}

export class MainPageController implements IComponentController {
    /**
     * Define dependencies
     */
    public static $inject = [ "$state", "dataService" ];

    public selectedDeviceId: number = -1;
    public selectedPages: number[] = [];
    public editingDevices: boolean = false;

    constructor(
        private $state: IStateService,
        private dataService: IDataService) {}

    /**
     * Exposes the devices from the data service
     */
    public get devices(): IDevice[] {
        if ((this.selectedDeviceId === -1 && this.dataService.devices.length > 0)
            || (!this.dataService.devices.some((d) => d.id === this.selectedDeviceId) && this.selectedDeviceId > -1 )) {
            this.selectDevice(this.dataService.devices[0].id);
        }
        return this.dataService.devices;
    }

    /**
     * Component initialization
     */
    public $onInit() {
        this.changeView();
    }

    /**
     * Close main window
     */
    public close() {
        const state = this.$state.current.name + ".close";
        this.$state.go(state);
    }

    /**
     * Switch to edit devices view
     */
    public editDevices() {
        this.editingDevices = true;
        this.changeView();
    }

    /**
     * Switch to edit pages view
     */
    public editPages(): any {
        this.editingDevices = false;
        this.changeView();
    }

    /**
     * Request a device selection change
     * @param deviceId the new device to be selected
     */
    public selectDevice(deviceId: number) {
        this.selectedDeviceId = deviceId;
        this.changeView();
    }

    /**
     * Request to add a new device
     */
    public addDevice() {
        this.dataService.addNewDevice();
    }

    /**
     * Delete the requested device
     * @param deviceId the device to be deleted
     */
    public deleteDevice(deviceId: number): void {
        const deviceSelection: IIdParam = { id: deviceId };
        const state = this.$state.current.name + ".deletedevice";
        this.$state.go(state, deviceSelection);
    }

    /**
     * Selects the edition view
     */
    private changeView() {
        if (this.selectedDeviceId < 0) {
            return;
        }
        const deviceSelection: IDeviceSelection = { deviceId: this.selectedDeviceId };
        const view = this.editingDevices ? "device" : "pages";
        this.$state.go(view, deviceSelection);
    }
}
