import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ModalManagerService, UserInterfaceLibModule } from "../Ng-Ui-Lib";
import { IModalDescription } from "../Ng-Ui-Lib/modal/modal-manager.service";
import { AppServicesModule } from "../Services";
import { ConfirmationDialogComponent } from "./confirmationDialog/confirmation-dialog.component.ng2";
import { DeviceEditComponent } from "./deviceEdit/device-edit.component.ng2";
import { DevicePanelComponent } from "./devicePanel/device-panel.component.ng2";
import { LocalizationService } from "./localization.service";
import { PageGridComponent } from "./pageGrid/page-grid.component.ng2";
import { SettingsDialogComponent } from "./settingsDialog/settings-dialog.component.ng2";
import { ToolBarComponent } from "./toolBar/toolbar.component.ng2";

export { ConfirmationDialogComponent } from "./confirmationDialog/confirmation-dialog.component.ng2";
export { SettingsDialogComponent } from "./settingsDialog/settings-dialog.component.ng2";
export { DevicePanelComponent } from "./devicePanel/device-panel.component.ng2";
export { DeviceEditComponent } from "./deviceEdit/device-edit.component.ng2";
export { ToolBarComponent } from "./toolBar/toolbar.component.ng2";
export { PageGridComponent } from "./pageGrid/page-grid.component.ng2";
export { LocalizationService } from "./localization.service";

export enum EModals {
    Confimation = "confirmation",
    Settings = "settings"
}

interface IModalDefinition {
    name: EModals;
    description: IModalDescription;
}

const modals: IModalDefinition[] = [
    { name: EModals.Confimation, description: { content: ConfirmationDialogComponent, settings: { size: "lg"}}},
    { name: EModals.Settings, description: { content: SettingsDialogComponent, settings: { size: "sm"}}},
];

@NgModule({
    declarations: [
        ConfirmationDialogComponent,
        SettingsDialogComponent,
        DevicePanelComponent,
        DeviceEditComponent,
        ToolBarComponent,
        PageGridComponent
    ],
    entryComponents: [
        ConfirmationDialogComponent,
        SettingsDialogComponent,
        DevicePanelComponent,
        DeviceEditComponent,
        ToolBarComponent,
        PageGridComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AppServicesModule,
        TranslateModule,
        UserInterfaceLibModule
     ],
     providers: [ LocalizationService ]
})
export class ComponentsModule {
    constructor(modalManager: ModalManagerService) {
        modals.forEach((modal: IModalDefinition) => {
            modalManager.register(modal.name, modal.description);
        });
    }
}
