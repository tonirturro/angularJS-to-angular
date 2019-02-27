import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IDialogParam, IMessageParam } from "../../Components/definitions";

@Component({
    selector: "confirmation-dialog",
    styles: [ ".centered-header { display: flex;  width: 100%; justify-content: center; }" ],
    template: require("./confirmation-dialog.template.htm")
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
