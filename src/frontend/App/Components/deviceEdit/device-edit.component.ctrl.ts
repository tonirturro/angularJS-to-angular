import { IComponentController } from "angular";
import { DataService } from "../../Services/DataService";

interface IReportDeviceName {
    name: string;
}

export class DeviceEditController implements IComponentController {
    /**
     * Define dependencies
     */
    public static $inject = ["dataService"];

    /**
     * From bindings
     */
    public selectedDeviceId: string;
    public onApply: (data: IReportDeviceName) => void;

    /**
     * Binded to view
     */
    public deviceName: string;

    /**
     * Initializes a new instance from the DeviceEditController class
     * @param dataService injected service to access the model
     */
    constructor(private dataService: DataService) { }

    /**
     * Initialize from model data
     */
    public $onInit() {
        const device = this.dataService.devices.find((d) => d.id.toString() === this.selectedDeviceId);
        this.deviceName = (device) ? device.name : "";
    }

    /**
     * Process apply button
     * @param newName the name to apply
     */
    public apply() {
        this.dataService.updateDeviceName(parseInt(this.selectedDeviceId, 10), this.deviceName);
    }
}
