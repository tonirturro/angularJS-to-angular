/**
 * Handles the bindings inside the component
 */
export class ToolBarController {
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
