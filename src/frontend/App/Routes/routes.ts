import { IState, IStateProvider, ITransition } from "./ui-routes";

export class Routes {
    public static $inject = [ "$stateProvider" ];

    constructor(private $stateProvider: IStateProvider ) {
        const deviceEditState: IState = {
            component: "deviceEditWrapper",
            name: "device",
            resolve: {
                selectedDeviceId: [ "$transition$", ($transition$: ITransition) => $transition$.params().deviceId]
            },
            url: "/device/{deviceId}"
        };
        const pagesEditState: IState = {
            component: "pageGridWrapper",
            name: "pages",
            resolve: {
                selectedDeviceId: [ "$transition$", ($transition$: ITransition) => $transition$.params().deviceId]
            },
            url: "/pages/{deviceId}"
        };

        this.$stateProvider.state(deviceEditState);
        this.$stateProvider.state(pagesEditState);
    }
}
