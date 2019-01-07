import { IComponentOptions } from "angular";
import { DeleteDeviceDialogController } from "./delete-device-dialog.component.ctrl";

export const DeleteDeviceDialog: IComponentOptions = {
    bindings: {
        resolve: "<"
    },
    controller: DeleteDeviceDialogController,
    controllerAs: "deleteDeviceDialogController",
    templateUrl: "deleteDevice/delete-device-dialog.template.htm"
};
