import { Component, Input, Output } from "@angular/core";
import { IDialogParam, IMessageParam } from "../../Components/definitions";

@Component({
    selector: "confirmation-dialog",
    styles: [ ".centered-header { display: flex;  width: 100%; justify-content: center; }" ],
    template: require("./confirmation-dialog.template.htm")
})
export class ConfirmationDialogComponent {
    @Input() public resolve: IDialogParam<IMessageParam>;
    @Output() public dismiss: () => void;
    @Output() public close: () => void;

    public get message(): string {
        return this.resolve.params.message;
    }
}
