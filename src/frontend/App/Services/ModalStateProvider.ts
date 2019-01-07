import { IServiceProvider } from "angular";
import * as angular from "angular";
import { IState, IStateService, ITransition } from "../ui-routes";
import { IModalService, IModalSettings } from "../UiLib/definitions";

export interface IModalStates {
    create(name: string, options: IModalSettings): IState;
}

export class ModalStateProvider implements IModalStates, IServiceProvider {
    public $get() {
        return this;
    }

    public create(name: string, options: IModalSettings): IState {
        let modalInstance;
        const modalSettings: IModalSettings = {};
        const baseDialogSettings: IModalSettings = {
            backdrop: "static",
            keyboard: false,
            size: "sm"
        };
        const onEnter = ($uiLibModal: IModalService, $state: IStateService, $transition$: ITransition) => {
            modalSettings.resolve = {
                params: () => $transition$.targetState().params()
            };
            modalInstance = $uiLibModal.open(modalSettings);
            modalInstance.result.finally(() => {
                modalInstance = null;
                if ($state.$current.name === name) {
                    $state.go("^");
                }
            });
        };
        onEnter.$inject = [ "$uiLibModal", "$state", "$transition$" ];
        const onExit = () => {
            if (modalInstance) {
                modalInstance.close();
                modalInstance = null;
            }
        };

        angular.extend(modalSettings, options, baseDialogSettings);
        const urlSegments = name.split(".");
        let url = "";
        urlSegments.forEach((segment) => {
            url = url.concat("/", segment);
        });

        const result = {
            name,
            onEnter,
            onExit,
            url
        } as IState;

        return result;
    }
}
