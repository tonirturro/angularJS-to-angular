import { NgModule } from "@angular/core";
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
    imports: [ AppServicesModule ]
})
export class ComponentsModule {}
