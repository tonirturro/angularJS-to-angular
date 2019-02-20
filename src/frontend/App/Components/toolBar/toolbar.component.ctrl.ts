/**
 * Handles the bindings inside the component
 */
export class ToolBarController {
    /*
     * Text output
     */
    public readonly addDeviceButton = "Add New Device";
    public readonly addDeviceTooltip = "Define a new device to operate with";
    public readonly editDeviceButton = "Edit Devices";
    public readonly editDeviceTooltip = "Modify properties for the selected device";
    public readonly editPagesButton = "Edit Pages";
    public readonly editPagesTooltip = "Add new pages or modify properties for the selected ones";
    public readonly closeTooltip = "Close the application";

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
