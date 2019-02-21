import { IComponentOptions } from "angular";
import { SettingsDialogController } from "./settings-dialog.component.ctrl";

export const SettingsDialog: IComponentOptions = {
    bindings: {
        close: "&",
        dismiss: "&"
    },
    controller: SettingsDialogController,
    controllerAs: "settingsDialogController",
    templateUrl: "settingsDialog/settings-dialog.template.htm"
};
