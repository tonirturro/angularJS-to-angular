import { IWindowService } from "angular";
import { IStateService } from "../../ui-routes";

export class CloseDialogController {

    public static $inject = [ "$window",  "$state" ];

    constructor(
        private $window: IWindowService,
        private $state: IStateService) {}

    /**
     * When clicked cancel
     */
    public cancel() {
        this.$state.go("^");
    }

    /**
     * When clicked ok
     */
    public ok() {
        this.$window.close();
    }
}
