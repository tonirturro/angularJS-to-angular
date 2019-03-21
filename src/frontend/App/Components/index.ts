import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { UIRouterModule } from "@uirouter/angular";
import { AppServicesModule } from "../Services";
import { UserInterfaceLibModule } from "../UiLib";
import { IModalDescription, ModalManagerService } from "../UiLib/modal/modal-manager.service";
import { ConfirmationDialogComponent } from "./confirmationDialog/confirmation-dialog.component";
import { EModals } from "./definitions";
import { DeviceEditComponent } from "./deviceEdit/device-edit.component";
import { DevicePanelComponent } from "./devicePanel/device-panel.component";
import { LocalizationService } from "./localization.service";
import { MainPageComponent } from "./main-page.component";
import { PageGridComponent } from "./pageGrid/page-grid.component";
import { SettingsDialogComponent } from "./settingsDialog/settings-dialog.component";
import { ToolBarComponent } from "./toolBar/toolbar.component";

export { MainPageComponent } from "./main-page.component";

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
        MainPageComponent,
        ConfirmationDialogComponent,
        SettingsDialogComponent
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
