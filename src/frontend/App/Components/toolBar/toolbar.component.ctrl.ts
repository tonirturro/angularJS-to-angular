/**
 * Handles the bindings inside the component
 */
export class ToolBarController {
    /*
     * Text output
     */
    public readonly addDeviceTooltip = "STR_ Add_Device_Tooltip";
    public readonly editDeviceTooltip = "STR_Edit_Device_Tooltip";
    public readonly editPagesTooltip = "STR_Edit_Pages_Tooltip";
    public readonly closeTooltip = "STR_Close_Tooltip";

    /**
     * Bindings
     */
    public editingDevices: boolean;
    public onAddDevice: () => void;
    public onClose: () => void;
    public onEditDevices: () => void;
    public onEditPages: () => void;

    /**
     * Report add action
     */
    public addDevice() {
        this.onAddDevice();
    }

    /**
     * Report edit devices action
     */
    public editDevices() {
        this.onEditDevices();
    }

    /**
     * Report edit devices action
     */
    public editPages() {
        this.onEditPages();
    }

    /**
     * Report close action
     */
    public close() {
        this.onClose();
    }
}
