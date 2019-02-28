import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IDialogParam, IMessageParam } from "../../Components/definitions";

@Component({
    selector: "confirmation-dialog",
    styleUrls: [ "./confirmation-dialog.component.css" ],
    templateUrl: "./confirmation-dialog.component.htm"
})
export class ConfirmationDialogComponent {
    @Input() public resolve: IDialogParam<IMessageParam>;
    @Output() public dismiss = new EventEmitter<any>();
    @Output() public close = new EventEmitter<any>();

    public get message(): string {
        return this.resolve.params.message;
    }

    public onClose() {
        this.close.emit();
    }

    public onDismiss() {
        this.dismiss.emit();
    }
}
