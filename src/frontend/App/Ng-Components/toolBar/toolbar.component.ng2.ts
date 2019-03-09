import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "toolbar",
    styleUrls: [ "./toolbar.component.scss" ],
    templateUrl: "./toolbar.component.html"
})

export class ToolBarComponent {
    /*
     * Text output
     */
    public readonly addDeviceTooltip = "STR_Add_Device_Tooltip";
    public readonly editDeviceTooltip = "STR_Edit_Device_Tooltip";
    public readonly editPagesTooltip = "STR_Edit_Pages_Tooltip";
    public readonly settingsTooltip = "STR_Settings";
    public readonly closeTooltip = "STR_Close_Tooltip";

    /**
     * Bindings
     */
     @Input() public editingDevices: boolean;
     @Output() public onAddDevice = new EventEmitter<any>();
     @Output() public onEditDevices = new EventEmitter<any>();
     @Output() public onEditPages = new EventEmitter<any>();
     @Output() public onSettings = new EventEmitter<any>();
     @Output() public onClose = new EventEmitter<any>();

    /**
     * Report add action
     */
    public addDevice() {
        this.onAddDevice.emit();
    }

    /**
     * Report edit devices action
     */
    public editDevices() {
        this.onEditDevices.emit();
    }

    /**
     * Report edit devices action
     */
    public editPages() {
        this.onEditPages.emit();
    }

    /**
     * Report settings action
     */
    public settings() {
        this.onSettings.emit();
    }

    /**
     * Report close action
     */
    public close() {
        this.onClose.emit();
    }
}
