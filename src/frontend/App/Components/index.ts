import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { UIRouterModule } from "@uirouter/angular";
import { ModalManagerService, UserInterfaceLibModule } from "../Ng-Ui-Lib";
import { IModalDescription } from "../Ng-Ui-Lib/modal/modal-manager.service";
import { AppServicesModule } from "../Services";
import { ConfirmationDialogComponent } from "./confirmationDialog/confirmation-dialog.component";
import { DeviceEditComponent } from "./deviceEdit/device-edit.component";
import { DevicePanelComponent } from "./devicePanel/device-panel.component";
import { LocalizationService } from "./localization.service";
import { MainPageComponent } from "./main-page.component";
import { PageGridComponent } from "./pageGrid/page-grid.component.ng2";
import { SettingsDialogComponent } from "./settingsDialog/settings-dialog.component";
import { ToolBarComponent } from "./toolBar/toolbar.component";

export { ConfirmationDialogComponent } from "./confirmationDialog/confirmation-dialog.component";
export { SettingsDialogComponent } from "./settingsDialog/settings-dialog.component";
export { DevicePanelComponent } from "./devicePanel/device-panel.component";
export { DeviceEditComponent } from "./deviceEdit/device-edit.component";
export { ToolBarComponent } from "./toolBar/toolbar.component";
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
    { name: EModals.Confimation, description: { content: ConfirmationDialogComponent, settings: { size: "lg" }}},
    { name: EModals.Settings, description: { content: SettingsDialogComponent, settings: { size: "sm" }}},
];

@NgModule({
    declarations: [
        ConfirmationDialogComponent,
        SettingsDialogComponent,
        DevicePanelComponent,
        DeviceEditComponent,
        ToolBarComponent,
        PageGridComponent,
        MainPageComponent
    ],
    entryComponents: [
        ConfirmationDialogComponent,
        SettingsDialogComponent,
        DevicePanelComponent,
        DeviceEditComponent,
        ToolBarComponent,
        PageGridComponent,
        MainPageComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AppServicesModule,
        TranslateModule,
        UIRouterModule.forChild(),
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
