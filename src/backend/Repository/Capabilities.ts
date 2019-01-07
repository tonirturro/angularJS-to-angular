import { PageFields } from "../../common/model";
import { ISelectableOption } from "../../common/rest";

export class Capabilities {
    public static PageOptions = [ "A3", "A2", "A1", "A0"];
    public static PrintQualities = [ "Fast", "Normal", "Best" ];
    public static MediaTypes = [ "Plain", "Coated", "Photo" ];
    public static Destinations = [ "Basket", "Stacker", "Folder"];
    private capabilitiesValues: { [index: string]: ISelectableOption[] } = {};

    constructor() {
        this.capabilitiesValues[PageFields.PageSize] =
            Capabilities.PageOptions.map((value, index) => this.getOption(index, value) );
        this.capabilitiesValues[PageFields.PrintQuality] =
            Capabilities.PrintQualities.map((value, index) => this.getOption(index, value));
        this.capabilitiesValues[PageFields.MediaType] =
            Capabilities.MediaTypes.map((value, index) => this.getOption(index, value));
        this.capabilitiesValues[PageFields.Destination] =
            Capabilities.Destinations.map((value, index) => this.getOption(index, value));
    }

    public getCapabilities(capability: string): ISelectableOption[] {
        return this.capabilitiesValues[capability];
    }

    private getOption(index: number, value: string): ISelectableOption {
        return { value: index.toString(), label: value } as ISelectableOption;
    }
}
