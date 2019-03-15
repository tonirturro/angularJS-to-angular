import { Component, Input } from "@angular/core";
import { IMessageParam } from "../../Components/definitions";
import { NgbActiveModal } from "../../Ng-Ui-Lib";

@Component({
    selector: "confirmation-dialog",
    styleUrls: [ "./confirmation-dialog.component.css" ],
    templateUrl: "./confirmation-dialog.component.html"
})
export class ConfirmationDialogComponent {
    @Input() public params: IMessageParam;

    constructor(private activeModal: NgbActiveModal) {}

    public get message(): string {
        return this.params.message;
    }

    public onClose() {
        this.activeModal.close();
    }

    public onDismiss() {
        this.activeModal.dismiss();
    }
}
