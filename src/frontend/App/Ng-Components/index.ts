import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { AppServicesModule } from "../Services";
import { ConfirmationDialogComponent } from "./confirmationDialog/confirmation-dialog.component.ng2";
import { SettingsDialogComponent } from "./settingsDialog/settings-dialog.component.ng2";

export { ConfirmationDialogComponent } from "./confirmationDialog/confirmation-dialog.component.ng2";
export { SettingsDialogComponent } from "./settingsDialog/settings-dialog.component.ng2";

@NgModule({
    declarations: [
        ConfirmationDialogComponent,
        SettingsDialogComponent
    ],
    entryComponents: [
        ConfirmationDialogComponent,
        SettingsDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AppServicesModule,
        TranslateModule
     ]
})
export class ComponentsModule {}
