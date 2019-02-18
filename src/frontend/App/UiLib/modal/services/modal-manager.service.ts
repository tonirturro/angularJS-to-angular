import * as angular from "angular";
import { IPromise, IQService } from "angular";
import { IModalInstanceService, IModalService, IModalSettings } from "../../definitions";

interface IDialogDictionary {
    [key: string]: IModalSettings;
}

export class ModalManager {

    public static $inject = ["$uiLibModal", "$q"];

    private readonly modalDefinitions: IDialogDictionary = {};
    private readonly modalStack: IModalInstanceService[] = [];
    private readonly baseDialogSettings: IModalSettings = {
        backdrop: "static",
        keyboard: false,
        size: "sm"
    };

    constructor(
        private $uiLibModal: IModalService,
        private $q: IQService) {}

    /**
     * Registers the modal settings to be used when opening it
     * @param name The dialog name to be registered
     * @param settings the settings associated to this dialog
     */
    public register(name: string, settings: IModalSettings): boolean {
        if (!this.modalDefinitions.hasOwnProperty(name)) {
            const modalSettings: IModalSettings = {};
            angular.extend(modalSettings, this.baseDialogSettings, settings);
            this.modalDefinitions[name] = modalSettings;
            return true;
        }

        return false;
    }

    /**
     * Open a new dialog on the top of the current one
     * @param name the name of the dialog to be opened
     * @param params optional params to be submitted to the dialog
     */
    public push(name: string, params?: any): IPromise<any> {
        if (this.modalDefinitions.hasOwnProperty(name)) {
            let dialogSettings: IModalSettings = {};
            if (params) {
                angular.extend(dialogSettings, this.modalDefinitions[name], { resolve: { params } });
            } else {
                dialogSettings = this.modalDefinitions[name];
            }
            const modalInstance = this.$uiLibModal.open(dialogSettings);
            this.modalStack.push(modalInstance);
            const deferred = this.$q.defer();
            modalInstance.result.then((resultClose) => {
                this.modalStack.pop();
                deferred.resolve(resultClose);
            }, (resultDismiss) => {
                this.modalStack.pop();
                deferred.reject(resultDismiss);
            });
            return deferred.promise;
        }
    }

    /**
     * Closes the last opened dialog and removes it from the stack
     */
    public pop() {
        if (this.modalStack.length > 0) {
            const instance = this.modalStack[this.modalStack.length - 1];
            instance.close();
        }
    }

    /**
     * Closes the last opened dialog and open a new dialog at the same stack level
     * @param name the name of the dialog to be opened
     */
    public replaceTop(name: string, params?: any) {
        this.pop();
        this.push(name, params);
    }

}
