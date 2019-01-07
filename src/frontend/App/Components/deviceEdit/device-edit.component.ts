import { IComponentOptions } from "angular";
import { DeviceEditController } from "./device-edit.component.ctrl";
import "./device-edit.styles.scss";

export const DeviceEdit: IComponentOptions = {
    bindings: {
        selectedDeviceId: "<"
    },
    controller: DeviceEditController,
    controllerAs: "deviceEditController",
    templateUrl: "deviceEdit/device-edit.template.htm"
};
