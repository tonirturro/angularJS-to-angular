import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IDevice } from "../../../../common/rest";

@Component({
    selector: "device-panel",
    styleUrls: [ "./device-panel.component.scss" ],
    templateUrl: "./device-panel.component.html"
})

export class DevicePanelComponent {
    @Input() public devices: IDevice[];
    @Input() public selectedDeviceId: number;
    @Output() public onDeleteDevice = new EventEmitter<number>();
    @Output() public onSelectedDevice = new EventEmitter<number>();

    /**
     * Delete the requested device
     * @param deviceId the device to be deleted
     * @param event the mouse event that should not go to select
     */
    public deleteDevice(event: Event, deviceId: number): void {
        event.stopPropagation();
        this.onDeleteDevice.emit(deviceId);
    }

    /**
     * Selects a device
     * @param deviceId the id for the selected device
     */
    public selectDevice(deviceId: number): void {
        this.onSelectedDevice.emit(deviceId);
    }
}
