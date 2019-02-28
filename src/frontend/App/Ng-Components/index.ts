import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { AppServicesModule } from "../Services";
import { ConfirmationDialogComponent } from "./confirmationDialog/confirmation-dialog.component";

export { ConfirmationDialogComponent } from "./confirmationDialog/confirmation-dialog.component";

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
