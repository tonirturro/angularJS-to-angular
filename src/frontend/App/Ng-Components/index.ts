import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { AppServicesModule } from "../Services";
import { ConfirmationDialogComponent } from "./confirmationDialog/confirmation-dialog.component.ng2";

export { ConfirmationDialogComponent } from "./confirmationDialog/confirmation-dialog.component.ng2";

@NgModule({
    declarations: [
        ConfirmationDialogComponent
    ],
    entryComponents: [
        ConfirmationDialogComponent
    ],
    imports: [
        AppServicesModule,
        TranslateModule
     ]
})
export class ComponentsModule {}
