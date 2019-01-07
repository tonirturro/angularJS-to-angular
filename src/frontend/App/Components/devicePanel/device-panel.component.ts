import { IComponentOptions } from "angular";
import { DevicePanelController } from "./device-panel.component.ctrl";

/**
 * Where the available devices will be displayed
 */
export const DevicePanel: IComponentOptions = {
    bindings: {
        devices: "<",
        onDeleteDevice: "&",
        onSelectedDevice: "&",
        selectedDeviceId: "<"
    },
    controller: DevicePanelController,
    controllerAs: "devicePanelController",
    templateUrl: "devicePanel/device-panel.template.htm"
};
