import "./settings-dialog.styles.css";

import { IComponentOptions } from "angular";
import { SettingsDialogController } from "./settings-dialog.component.ctrl";

export const SettingsDialog: IComponentOptions = {
    bindings: {
        close: "&",
        dismiss: "&",
        resolve: "<"
    },
    controller: SettingsDialogController,
    controllerAs: "settingsDialogController",
    templateUrl: "settingsDialog/settings-dialog.template.htm"
};
