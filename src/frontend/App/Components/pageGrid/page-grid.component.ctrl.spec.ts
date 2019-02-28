import { IProvideService } from "@angular/upgrade/static/src/common/angular1";

import * as angular from "angular";
import { IComponentControllerService } from "angular";
import { Subject } from "rxjs";

import { PageFields } from "../../../../common/model";
import { ISelectableOption } from "../../../../common/rest";
import { DataServiceMock } from "../../Services/data.service.mock";
import { IDataService } from "../../Services/definitions";
import { LocalizationService } from "../localization.service";
import { NgTranslateServiceMock } from "../ng-translate.service.mock";
import { PageGridController } from "./page-grid.component.ctrl";

describe("Given a page grid controller", () => {
    const fakeMouseEvent: any = {
        ctrlKey: false,
        srcElement: {
            attributes: {
                getNamedItem: () => false
            }
        }
    };
    const selectedPage: any = {
        id: 1
    };
    const NewValue = "1";
    const capabilities: ISelectableOption[] = [
        {
            label: "capabilityLabel",
            value: "0"
        }
     ];

    /**
     * Common test resources
     */
    let controller: PageGridController;
    let updatePageMock: jasmine.Spy;
    let getCapabilitiesMock: jasmine.Spy;
    let getLocalizedCapabilityMock: jasmine.Spy;
    let localizationBroadcast: Subject<any>;

    beforeEach(angular.mock.module("myApp.components", ($provide: IProvideService) => {
        $provide.value("dataService", new DataServiceMock());
        $provide.value("ngTranslateService", new NgTranslateServiceMock());
    }));

    beforeEach(inject((
        $componentController: IComponentControllerService,
        dataService: IDataService,
        localizationService: LocalizationService) => {
        controller = $componentController("pageGrid", {});
        controller.selectPage(fakeMouseEvent, selectedPage.id );
        updatePageMock = spyOn(dataService, "updatePageField");
        getCapabilitiesMock = spyOn(dataService, "getCapabilities");
        getLocalizedCapabilityMock = spyOn(localizationService, "getLocalizedCapability");
        getCapabilitiesMock.and.returnValue(capabilities);
        localizationBroadcast = localizationService.language$ as Subject<any>;
    }));

    /**
     *
     *  The test cases
     *
     */
    it("When the component has been initialized " +
        "Then the localization service is called for each one of the capabilites", () => {
       controller.$onInit();

       expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.PrintQuality);
       expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.MediaType);
       expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.Destination);
       expect(getLocalizedCapabilityMock).toHaveBeenCalledWith(capabilities[0]);
       expect(getLocalizedCapabilityMock).toHaveBeenCalledTimes(3);
    });

    it("When changing page size Then the corresponding update model call is made", () => {
        controller.updatePageSize(NewValue);

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.PageSize, [ selectedPage.id ], NewValue);
    });

    it("When changing print quality Then the corresponding update model call is made", () => {
        controller.updatePrintQuality(NewValue);

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.PrintQuality, [ selectedPage.id ], NewValue);
    });

    it("When changing media type Then the corresponding update model call is made", () => {
        controller.updateMediaType(NewValue);

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.MediaType, [ selectedPage.id ], NewValue);
    });

    it("When changing destination Then the corresponding update model call is made", () => {
        controller.updateDestination(NewValue);

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.Destination, [ selectedPage.id ], NewValue);
    });

    it("When changing language Then the capabilities are updated", () => {
        controller.$onInit();
        getCapabilitiesMock.calls.reset();
        getLocalizedCapabilityMock.calls.reset();

        localizationBroadcast.next();

        expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.PrintQuality);
        expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.MediaType);
        expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.Destination);
        expect(getLocalizedCapabilityMock).toHaveBeenCalledWith(capabilities[0]);
        expect(getLocalizedCapabilityMock).toHaveBeenCalledTimes(3);

        controller.$onDestroy();
    });

});
