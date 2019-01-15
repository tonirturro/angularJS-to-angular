import { IProvideService } from "@angular/upgrade/static/src/common/angular1";
import * as angular from "angular";
import { IAugmentedJQuery, ICompileService, IRootScopeService } from "angular";
import { PageFields } from "../../../../common/model";
import { IPage, ISelectableOption } from "../../../../common/rest";
import { IDataService } from "../../Services/definitions";

describe("Given a page grid component ", () => {
    const SelectedDeviceId = 1;
    let element: IAugmentedJQuery;
    let scope: any;
    let rootScope: IRootScopeService;
    let dataServiceToMock: IDataService;

    const InitialPages: IPage[] = [
        {
            destination: "1", deviceId: SelectedDeviceId, id: 0, mediaType: "1", pageSize: "1", printQuality: "1"
        } as IPage,
        {
            destination: "1", deviceId: SelectedDeviceId, id: 1, mediaType: "1", pageSize: "1", printQuality: "1"
        } as IPage,
        {
            destination: "1", deviceId: SelectedDeviceId, id: 2, mediaType: "1", pageSize: "1", printQuality: "1"
        } as IPage,
    ];
    const Capabilities: { [key: string]: ISelectableOption[] } = {};
    const PageSizeCapabilities: ISelectableOption[] = [
        { value: "0", label: "page0" },
        { value: "1", label: "page1" }
    ];
    const PrintQualityCapabilities: ISelectableOption[] =  [
        { value: "0", label: "quality0" },
        { value: "1", label: "quality1" }
    ];
    const MediaTypeCapabilities: ISelectableOption[] = [
        { value: "0", label: "media0" },
        { value: "1", label: "media1" }
    ];
    const DestinationCapabilities: ISelectableOption[] = [
        { value: "0", label: "destination0" },
        { value: "1", label: "destination1" }
    ];

    beforeEach(angular.mock.module("myApp.components", ($provide: IProvideService) => {
        $provide.value("dataService", {
            // tslint:disable-next-line:no-empty
            addNewPage: () => {}, deletePage: () => {}, getCapabilities: () => {}, get pages() { return []; }
        });
    }));

    beforeEach(() => {
        Capabilities[PageFields.PageSize] = PageSizeCapabilities;
        Capabilities[PageFields.PrintQuality] = PrintQualityCapabilities;
        Capabilities[PageFields.MediaType] = MediaTypeCapabilities;
        Capabilities[PageFields.Destination] = DestinationCapabilities;
    });

    beforeEach(inject((
        dataService: IDataService,
        $compile: ICompileService,
        $rootScope: IRootScopeService) => {
        dataServiceToMock = dataService;
        rootScope = $rootScope;
        spyOnProperty(dataService, "pages", "get").and.returnValue(InitialPages);
        spyOn(dataService, "getCapabilities").and.callFake((capability: string) => Capabilities[capability]);
        scope = $rootScope.$new();
        scope.selectedDeviceID = SelectedDeviceId;
        element = angular.element(`<page-grid selected-device-id="selectedDeviceID" />`);
        element = $compile(element)(scope);
        rootScope.$apply();
    }));

    it("When created Then it has the html defined", () => {
        expect(element.html).toBeDefined();
    });

    it("When created Then the component has the pages set by the model", () => {
        expect(element.find("tbody").find("tr").length).toBe(InitialPages.length);
    });

    it("When the selected device id does not match the one from the initiial pages " +
       "Then the component does not display any page", () => {
        scope.selectedDeviceID = SelectedDeviceId + 1;
        rootScope.$apply();

        expect(element.find("tbody").find("tr").length).toBe(0);
    });

    it("When created Then it has not selected pages", () => {
        const pages = element.find("tbody").find("tr");
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < pages.length; index++) {
            expect(pages[index].classList.contains("item-selected")).toBeFalsy();
        }
    });

    xit("When a page is selected Then it is displayed as selected", () => {
        const SelectedItem = 0;
        const pages = element.find("tbody").find("tr");

        pages[SelectedItem].click();

        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < pages.length; index++) {
            if (index === SelectedItem ) {
                expect(pages[index].classList.contains("item-selected")).toBeTruthy();
            } else {
                expect(pages[index].classList.contains("item-selected")).toBeFalsy();
            }
        }
    });

    // Debug when symbols available
    xit("When page selected and anotheris clicked Then the first one is displayed as not selected", () => {
        const SelectedItem1 = 0;
        const SelectedItem2 = 1;
        const pages = element.find("tbody").find("tr");

        pages[SelectedItem1].click();
        pages[SelectedItem2].click();

        expect(pages[SelectedItem1].classList.contains("item-selected")).toBeFalsy();
        expect(pages[SelectedItem2].classList.contains("item-selected")).toBeTruthy();
    });

    it("When capabilities are reported Then they are displayed", () => {
        const options = element.find("option");
        let offset = 0;
        expect(options[offset++].innerText).toBe(Capabilities[PageFields.PageSize][0].label);
        expect(options[offset++].innerText).toBe(Capabilities[PageFields.PageSize][1].label);
        expect(options[offset++].innerText).toBe(Capabilities[PageFields.PrintQuality][0].label);
        expect(options[offset++].innerText).toBe(Capabilities[PageFields.PrintQuality][1].label);
        expect(options[offset++].innerText).toBe(Capabilities[PageFields.MediaType][0].label);
        expect(options[offset++].innerText).toBe(Capabilities[PageFields.MediaType][1].label);
        expect(options[offset++].innerText).toBe(Capabilities[PageFields.Destination][0].label);
        expect(options[offset++].innerText).toBe(Capabilities[PageFields.Destination][1].label);
    });

    it("When a page is added Then the adition is reported", () => {
        spyOn(dataServiceToMock, "addNewPage");
        const addButton = element.find("thead").find("tr").find("button")[0];

        addButton.click();

        expect(dataServiceToMock.addNewPage).toHaveBeenCalledWith(SelectedDeviceId);
    });

    xit("When a page is deleted Then the deletion is reported", () => {
        spyOn(dataServiceToMock, "deletePage");
        const selectedPage = 1;
        const deleteButton = element.find("tbody").find("tr").find("button");

        deleteButton[selectedPage].click();

        expect(dataServiceToMock.deletePage).toHaveBeenCalledWith(InitialPages[selectedPage].id);
    });
});
