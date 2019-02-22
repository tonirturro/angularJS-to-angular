import * as angular from "angular";
import { ISelectableOption } from "../../../../common/rest";
import { PageGridService } from "./page-grid.service";

describe("Given a page grid service", () => {
    const capability: ISelectableOption = {
        label: "Name",
        value: "0"
    };
    let service: PageGridService;
    let getStringMock: jasmine.Spy;

    beforeEach(angular.mock.module("myApp.components"));

    beforeEach(inject((
        pageGridService: PageGridService,
        gettextCatalog: angular.gettext.gettextCatalog
    ) => {
        service = pageGridService;
        getStringMock = spyOn(gettextCatalog, "getString");
    }));

    it("When asking for a capability literal Then the localization service is called", () => {
        const expectedLocalizationKey =  `STR_${capability.label}`;

        service.getLocalizedCapability(capability);

        expect(getStringMock).toHaveBeenCalledWith(expectedLocalizationKey);
    });

    it("When asking for a capability literal Then it returns the expected localization", () => {
        const expectedLocalizedCapability: ISelectableOption =  {
            label: "Translated Name",
            value: capability.value
        };
        getStringMock.and.returnValue(expectedLocalizedCapability.label);

        const localizedCapability = service.getLocalizedCapability(capability);

        expect(localizedCapability).toEqual(expectedLocalizedCapability);
    });
});
