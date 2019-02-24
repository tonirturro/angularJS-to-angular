import { IComponentController, ILogService, IWindowService } from "angular";

import { EModals } from ".";
import { IDevice } from "../../../common/rest";
import { IStateService } from "../Routes/ui-routes";
import { DataService } from "../Services/data.service";
import { ModalManager } from "../UiLib/modal/services/modal-manager.service";
import { ELanguages, ILanguageParam, IMessageParam } from "./definitions";
import { LocalizationService } from "./localization.service";

export interface IDeviceSelection {
    deviceId: number;
}

export class MainPageController implements IComponentController {
    /**
     * Define dependencies
     */
    public static $inject = [ "$log", "$window", "$state", "dataService", "modalManager", "localizationService" ];

    public selectedDeviceId: number = -1;
    public selectedPages: number[] = [];
    public editingDevices: boolean = false;

    private currentLanguage: ELanguages;

    constructor(
        private $log: ILogService,
        private $window: IWindowService,
        private $state: IStateService,
        private dataService: DataService,
        private modalManager: ModalManager,
        private localizationService: LocalizationService) {}

    /**
     * Exposes the devices from the data service
     */
    public get devices(): IDevice[] {
        if (this.selectedDeviceId === -1 && this.dataService.devices.length > 0) {
            this.selectDevice(this.dataService.devices[0].id);
        } else if (this.dataService.devices.length === 0) {
            if (this.selectedDeviceId !== -1) {
                this.selectedDeviceId = -1;
                this.$state.go("pages", { deviceId: -1 });
            }

        } else if (this.dataService.devices.every((item) => item.id !== this.selectedDeviceId)) {
            this.selectDevice(this.dataService.devices[0].id);
        }
        return this.dataService.devices;
    }

    /**
     * Component initialization
     */
    public $onInit() {
        this.currentLanguage = ELanguages.English;
        this.localizationService.setLanguage(this.currentLanguage);
        this.changeView();
    }

    /**
     * Launch the settings dialog
     */
    public settings() {
        this.modalManager
            .push(EModals.Settings, { language: this.currentLanguage } as ILanguageParam)
            .then((language: ELanguages) => {
                this.localizationService.setLanguage(language);
                this.currentLanguage = language;
            }, () => {
                this.$log.info("Dismissed settings dialog");
            });
    }

    /**
     * Close main window
     */
    public close() {
        const message = this.localizationService.closeMessage;
        this.modalManager
        .push(EModals.Confimation, { message } as IMessageParam)
        .then(() => {
            this.$window.close();
        }, () => {
            this.$log.info("Dismissed close application");
        });
    }

    /**
     * Switch to edit devices view
     */
    public editDevices() {
        this.editingDevices = true;
        this.changeView();
    }

    /**
     * Switch to edit pages view
     */
    public editPages(): any {
        this.editingDevices = false;
        this.changeView();
    }

    /**
     * Request a device selection change
     * @param deviceId the new device to be selected
     */
    public selectDevice(deviceId: number) {
        this.selectedDeviceId = deviceId;
        this.changeView();
    }

    /**
     * Request to add a new device
     */
    public addDevice() {
        this.dataService.addNewDevice();
    }

    /**
     * Delete the requested device
     * @param deviceId the device to be deleted
     */
    public deleteDevice(deviceId: number): void {
        const name = this.dataService.devices.find((d) => d.id === deviceId).name;
        const message = this.localizationService.deleteDeviceMessage;
        this.modalManager.push(EModals.Confimation, { message: `${message}: ${name}`})
            .then(() => {
                this.dataService.deleteDevice(deviceId);
            }, () => {
                this.$log.info(`Dismissed delete device: ${name}`);
            });
    }

    /**
     * Selects the edition view
     */
    private changeView() {
        if (this.selectedDeviceId < 0) {
            return;
        }
        const deviceSelection: IDeviceSelection = { deviceId: this.selectedDeviceId };
        const view = this.editingDevices ? "device" : "pages";
        this.$state.go(view, deviceSelection);
    }
}
