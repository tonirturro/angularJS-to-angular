import { IDialogParam, IMessageParam } from "../definitions";

export class ConfirmationDialogController {
        // from/to bindings
        public resolve: IDialogParam<IMessageParam>;
        public dismiss: () => void;
        public close: () => void;

        public get message(): string {
                return this.resolve.params.message;
        }
}
