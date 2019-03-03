import { Component, Input, OnInit } from "@angular/core";
import { DataService } from "../../Services/data.service";

@Component({
    selector: "device-edit",
    styleUrls: [ "./device-edit.component.css" ],
    templateUrl: "./device-edit.component.html"
})

export class DeviceEditComponent implements OnInit {
    @Input() public selectedDeviceId: string;

    public deviceName: string;

    public get deviceId(): number {
        return parseInt(this.selectedDeviceId, 10);
    }

    /**
     * Initializes a new instance from the DeviceEditController class
     * @param dataService injected service to access the model
     */
    constructor(private dataService: DataService) {}

    /**
     * Initialize from model data
     */
    public ngOnInit() {
        const device = this.dataService.devices.find((d) => d.id.toString() === this.selectedDeviceId);
        this.deviceName = (device) ? device.name : "";
    }

    /**
     * Process apply button
     */
    public apply() {
        this.dataService.updateDeviceName(this.deviceId, this.deviceName);
    }
}
