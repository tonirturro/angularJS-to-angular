import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { IProvideService } from "@angular/upgrade/static/src/common/angular1";
import { StateService } from "@uirouter/core";

import { IPromise, IQService, IWindowService } from "angular";
import * as angular from "angular";

import { PageFields } from "../../../common/model";
import { IDevice, ISelectableOption } from "../../../common/rest";
import { DataService } from "../Services/data.service";
import { IDataService } from "../Services/definitions";
import { IIdParam } from "./definitions";
import { IDeviceSelection, MainPageController } from "./main-page.component.ctrl";

describe("Given a main page component controller", () => {
    let controller: MainPageController;
    let q: IQService;
    let stateServiceToMock: StateService;
    let dataServiceToMock: IDataService;
    let windowServiceToMock: IWindowService;

    const devices: IDevice[] = [{
        id: 1,
        name: "Device 2"
    }];
    const PageSizeCapabilities: ISelectableOption[] = [
        { value: "0", label: "page0" },
        { value: "1", label: "page1" }
    ];
    const PrintQualityCapabilities: ISelectableOption[] = [
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

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DataService]
        });
    });

    beforeEach(angular.mock.module("myApp.components", ($provide: IProvideService) => {
        $provide.value("dataService", TestBed.get(DataService));
    }));

    beforeEach(inject(($componentController, $q, $state: StateService, $window, dataService) => {
        stateServiceToMock = $state;
        windowServiceToMock = $window;
        dataServiceToMock = dataService;
        q = $q;
        spyOn(stateServiceToMock, "go");
        spyOnProperty(dataServiceToMock, "devices", "get").and.returnValue(devices);
        spyOn(dataServiceToMock, "addNewDevice").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "deleteDevice").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "updatePageField").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "deletePage").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "addNewPage").and.returnValue(q.resolve(true));
        spyOn(dataServiceToMock, "getCapabilities")
            .and.callFake((capability: string): IPromise<ISelectableOption[]> => {
                switch (capability) {
                    case PageFields.PageSize:
                        return q.resolve(PageSizeCapabilities);
                    case PageFields.PrintQuality:
                        return q.resolve(PrintQualityCapabilities);
                    case PageFields.MediaType:
                        return q.resolve(MediaTypeCapabilities);
                    case PageFields.Destination:
                        return q.resolve(DestinationCapabilities);
                    default:
                        return q.reject("Invalid field");
                }
            });
        controller = $componentController("mainPage");
    }));

    it("When is ititialized Then it gets the existing devices", () => {
        controller.$onInit();

        expect(controller.devices).toEqual(devices);
    });

    it("When it is initialized Then it has not selected pages", () => {
        expect(controller.selectedPages.length).toBe(0);
    });

    it("When it is initialized Then it goes to the pages edition", () => {
        controller.selectedDeviceId = devices[0].id;
        const expectedDeviceSelection: IDeviceSelection = { deviceId: controller.selectedDeviceId };
        controller.$onInit();

        expect(stateServiceToMock.go).toHaveBeenCalledWith("pages", expectedDeviceSelection);
    });

    xit("When calling close Then the window sercice is called to close the window", () => {
        spyOn(windowServiceToMock, "close");

        controller.close();

        expect(windowServiceToMock.close).toHaveBeenCalled();
    });

    it("When calling edit devices Then the view changes to the device edition", () => {
        controller.selectedDeviceId = devices[0].id;
        const expectedDeviceSelection: IDeviceSelection = { deviceId: controller.selectedDeviceId };
        controller.editDevices();

        expect(controller.editingDevices).toBeTruthy();
        expect(stateServiceToMock.go).toHaveBeenCalledWith("device", expectedDeviceSelection);
    });

    it("When calling edit pages Then the view changes to the pages edition", () => {
        controller.selectedDeviceId = devices[0].id;
        const expectedDeviceSelection: IDeviceSelection = { deviceId: controller.selectedDeviceId };
        controller.editPages();

        expect(controller.editingDevices).toBeFalsy();
        expect(stateServiceToMock.go).toHaveBeenCalledWith("pages", expectedDeviceSelection);
    });

    it("When selecting device Then it is reflected by the associated property", () => {
        const ExpectedDeviceId = 5;
        controller.selectDevice(ExpectedDeviceId);
        expect(controller.selectedDeviceId).toBe(ExpectedDeviceId);
    });

    it("When selecting device Then the view is adjusted with the selected device", () => {
        const ExpectedDeviceId = 8;
        controller.editingDevices = true;
        controller.selectDevice(ExpectedDeviceId);
        const expectedDeviceSelection: IDeviceSelection = { deviceId: controller.selectedDeviceId };

        expect(stateServiceToMock.go).toHaveBeenCalledWith("device", expectedDeviceSelection);
    });

    it("When adding a device Then the data service is called", () => {
        controller.addDevice();

        expect(dataServiceToMock.addNewDevice).toHaveBeenCalled();
    });

    it("When deleting the selected device Then the view is changed", () => {
        const idToDelete = 4;
        const currentView = "pages";
        const expectedView = currentView + ".deletedevice";
        const expectedDeviceSelection: IIdParam = { id: idToDelete };
        spyOnProperty(stateServiceToMock, "current", "get").and.returnValue( { name: currentView });

        controller.deleteDevice(idToDelete);

        expect(stateServiceToMock.go).toHaveBeenCalledWith(expectedView, expectedDeviceSelection);
    });
});
