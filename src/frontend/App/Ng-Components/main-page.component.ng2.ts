import { Component, OnInit } from "@angular/core";
import { StateService } from "@uirouter/angular";
import { EModals } from ".";
import { IDevice } from "../../../common/rest";
import { ModalManagerService } from "../Ng-Ui-Lib";
import { ApplicationService } from "../Services/application.service";
import { DataService } from "../Services/data.service";
import { LogService } from "../Services/log.service";
import { ELanguages, IDeviceSelection, ILanguageParam, IMessageParam } from "./definitions";
import { LocalizationService } from "./localization.service";

@Component({
    selector: "main-page",
    styleUrls: [ "./main-page.component.scss" ],
    templateUrl: "./main-page.component.html"
})

export class MainPageComponent implements OnInit {

    public selectedDeviceId: number = -1;
    public selectedPages: number[] = [];
    public editingDevices: boolean = false;

    private currentLanguage: ELanguages;

    constructor(
        private $log: LogService,
        private applicationService: ApplicationService,
        private $state: StateService,
        private dataService: DataService,
        private modalManager: ModalManagerService,
        private localizationService: LocalizationService) {}

    /**
     * Component initialization
     */
    public ngOnInit() {
        this.currentLanguage = ELanguages.English;
        this.localizationService.setLanguage(this.currentLanguage);
        this.changeView();
     }

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
     * Launch the settings dialog
     */
    public settings() {
        this.modalManager
            .push(EModals.Settings, { language: this.currentLanguage } as ILanguageParam)
            .subscribe((language: ELanguages) => {
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
        this.localizationService.closeMessage.subscribe((message) => {
            this.modalManager
            .push(EModals.Confimation, { message } as IMessageParam)
            .subscribe(() => {
                this.applicationService.close();
            }, () => {
                this.$log.info("Dismissed close application");
            });
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
        this.localizationService.deviceName.subscribe((name) => {
            this.dataService.addNewDevice(name);
        });
    }

    /**
     * Delete the requested device
     * @param deviceId the device to be deleted
     */
    public deleteDevice(deviceId: number): void {
        const name = this.dataService.devices.find((d) => d.id === deviceId).name;
        const message = this.localizationService.deleteDeviceMessage;
        this.modalManager.push(EModals.Confimation, { message: `${message}: ${name}`})
            .subscribe(() => {
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
