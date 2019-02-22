import { ISelectableOption } from "../../../../common/rest";

export class PageGridService {
    public static $inject = [ "gettextCatalog" ];

    constructor(private gettextCatalog: angular.gettext.gettextCatalog) {}

    public getLocalizedCapability(capability: ISelectableOption): ISelectableOption {
        const localizationKey = `STR_${capability.label}`;
        return {
            label: this.gettextCatalog.getString(localizationKey),
            value: capability.value
        } as ISelectableOption;
    }
}
