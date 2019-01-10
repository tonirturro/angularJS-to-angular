import { IModalSettings } from "../UiLib/definitions";
import { IModalStates } from "./modal-state-provider";
import { IState, IStateProvider, ITransition } from "./ui-routes";

export class Routes {
    public static $inject = [ "$stateProvider", "modalStateProvider" ];

    constructor(private $stateProvider: IStateProvider, private modalStateProvider: IModalStates) {
        const deviceEditState: IState = {
            component: "deviceEdit",
            name: "device",
            resolve: {
                selectedDeviceId: [ "$transition$", ($transition$: ITransition) => $transition$.params().deviceId]
            },
            url: "/device/{deviceId}"
        };
        const pagesEditState: IState = {
            component: "pageGrid",
            name: "pages",
            resolve: {
                selectedDeviceId: [ "$transition$", ($transition$: ITransition) => $transition$.params().deviceId]
            },
            url: "/pages/{deviceId}"
        };
        const closeDialog: IModalSettings = {
            component: "closeDialog"
        };
        const deleteDeviceDialog: IModalSettings = {
            component: "deleteDeviceDialog"
        };

        this.$stateProvider.state(deviceEditState);
        this.$stateProvider.state(pagesEditState);
        this.$stateProvider.state(this.modalStateProvider.create("pages.close", closeDialog));
        this.$stateProvider.state(this.modalStateProvider.create("device.close", closeDialog));
        this.$stateProvider.state(this.modalStateProvider.create("pages.deletedevice", deleteDeviceDialog));
        this.$stateProvider.state(this.modalStateProvider.create("device.deletedevice", deleteDeviceDialog));
    }
}
