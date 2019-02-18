import "./confirmation-dialog.component.css";

import { IComponentOptions } from "angular";
import { ConfirmationDialogController } from "./confirmation-dialog.component.ctrl";

export const ConfirmationDialog: IComponentOptions = {
    bindings: {
        close: "&",
        dismiss: "&",
        resolve: "<"
    },
    controller: ConfirmationDialogController,
    controllerAs: "confirmationDialogController",
    templateUrl: "confirmationDialog/confirmation-dialog.template.htm"
};
