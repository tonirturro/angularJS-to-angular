import { IComponentOptions } from "angular";
import { PageGridController } from "./page-grid.component.ctrl";

/**
 * Defines the grid containing the page settings
 */
export const PageGrid: IComponentOptions = {
    bindings: {
        selectedDeviceId: "<"
    },
    controller: PageGridController,
    templateUrl: "pageGrid/page-grid.template.htm"
};
