
import { IDevice } from "../../../../common/rest";

interface IReportDeviceId {
    deviceId: number;
}

/**
 * handles the bindings inside the component
 */
export class DevicePanelController {

    /**
     * Bindings
     */
    public devices: IDevice[];
    public selectedDeviceId: number;
    public onDeleteDevice: (data: IReportDeviceId ) => void;
    public onSelectedDevice: (data: IReportDeviceId ) => void;

    /**
     * Delete the requested device
     * @param deviceId the device to be deleted
     * @param event the mouse event that should not go to select
     */
    public deleteDevice(event: Event, deviceId: number): void {
        event.stopPropagation();
        this.onDeleteDevice({ deviceId });
    }

    /**
     * Selects a device
     * @param deviceId the id for the selected device
     */
    public selectDevice(deviceId: number): void {
        this.onSelectedDevice({ deviceId });
    }
}
