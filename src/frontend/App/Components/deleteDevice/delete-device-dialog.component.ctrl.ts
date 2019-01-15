import { IComponentController } from "angular";
import { IStateService } from "../../Routes/ui-routes";
import { IDataService } from "../../Services/definitions";
import { IIdParam } from "../definitions";

interface IDialogParamsId {
    params: IIdParam;
}

export class DeleteDeviceDialogController implements IComponentController {

    public static $inject = [ "$state", "dataService" ];

    // from/to bindings
    public resolve: IDialogParamsId;
    public name: string;
    private deviceId: number;

    constructor(
        private $state: IStateService,
        private dataService: IDataService) {}

    public $onInit() {
        this.deviceId = this.resolve.params.id;
        this.name = this.dataService.devices.find((d) => d.id === this.deviceId).name;
    }

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
        this.dataService.deleteDevice(this.deviceId);
        this.$state.go("^");
    }
}
