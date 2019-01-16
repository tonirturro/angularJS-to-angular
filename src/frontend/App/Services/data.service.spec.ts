import { HttpClientTestingModule, HttpTestingController, TestRequest } from "@angular/common/http/testing";
import { inject, TestBed } from "@angular/core/testing";

import { AppServicesModule } from ".";
import { PageFields } from "../../../common/model";
import {
    IDeleteDeviceResponse,
    IDeletePageResponse,
    IDevice,
    IPage,
    ISelectableOption,
    IUpdateDeviceParams,
    IUpdateParams,
    IUpdateResponse
} from "../../../common/rest";
import { DataService } from "./data.service";
import { LogService } from "./log.service";

describe("Given a data service", () => {
    const restUrl = "http://localhost:3000/REST";
    const pagesUrl = `${restUrl}/pages/`;
    const devicesUrl = `${restUrl}/devices/`;
    const deviceOptionsUrl = `${restUrl}/deviceOptions/`;
    const mockErrorResponse = { status: 400, statusText: "Bad Request" };
    const data = "Invalid request parameters";
    const fieldToSet = "anyField";
    const expectedDevices: IDevice[] = [{
        id: 1,
        name: "Device 2"
    }];
    const deleteDeviceResponse: IDeleteDeviceResponse = {
        deletedDeviceId: 1,
        success: true
    };
    const expectedPages: IPage[] = [{
        destination: "5",
        deviceId: 1,
        id: 1,
        mediaType: "4",
        pageSize: "2",
        printQuality: "3",
    }];
    const response: IUpdateResponse = {
        success: true
    };
    const deletePageResponse: IDeletePageResponse = {
        deletedPageId: 1,
        success: true
    };
    const updatePageParams = { pages: [10], newValue: "0" } as IUpdateParams;
    const ExpectedDeletePageCall = `${pagesUrl}${deletePageResponse.deletedPageId}`;
    const ExpectedUpdatePageCall = `${pagesUrl}${fieldToSet}`;
    const expectedDeleteDeviceCall = `${devicesUrl}${deleteDeviceResponse.deletedDeviceId}`;
    const ExpectedUpdateDeviceCall = `${devicesUrl}name/`;
    const ExpectedDeviceId = 1;
    const ExpectedDeviceValue = "any";
    const ExpectedParams: IUpdateDeviceParams = { id: ExpectedDeviceId, newValue: ExpectedDeviceValue };
    const ExpectedCapabilitiesCall = `${deviceOptionsUrl}${PageFields.PageSize}`;

    let service: DataService;
    let httpMock: HttpTestingController;
    let logService: LogService;
    let request: TestRequest;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, AppServicesModule],
        });
    });

    beforeEach(inject(
        [DataService, LogService, HttpTestingController], (
            serviceToTest: DataService,
            logServiceToMock: LogService,
            mock: HttpTestingController) => {
            service = serviceToTest;
            logService = logServiceToMock;
            httpMock = mock;
            request = null;
            spyOn(logService, "error");
        }
    ));

    afterEach(() => {
        httpMock.verify();
    });

    /************************************************************************
     * Pages
     ************************************************************************/
    it("When is working Then it exposes the available pages", () => {
        let pages = service.pages;
        request = httpMock.expectOne(pagesUrl);
        request.flush(expectedPages);
        pages = service.pages;

        expect(request.request.method).toEqual("GET");
        expect(pages.length).toBe(expectedPages.length);
    });

    it("When getting pages query fails Then the log is called", () => {
        const pages = service.pages;
        httpMock.expectOne(pagesUrl).error(new ErrorEvent("Query failed"));

        expect(logService.error).toHaveBeenCalled();
    });

    it("Can add pages", () => {
        service.addNewPage(ExpectedDeviceId);

        request = httpMock.expectOne(`${pagesUrl}${ExpectedDeviceId}`);
        expect(request.request.method).toEqual("POST");
    });

    it("When adding pages Then it refreshes the page list", () => {
        service.addNewPage(ExpectedDeviceId);

        request = httpMock.expectOne(`${pagesUrl}${ExpectedDeviceId}`);
        request.flush(response);

        request = httpMock.expectOne(pagesUrl);
        expect(request.request.method).toEqual("GET");
    });

    it("Can delete pages", () => {
        service.deletePage(deletePageResponse.deletedPageId);

        request = httpMock.expectOne(ExpectedDeletePageCall);
        expect(request.request.method).toEqual("DELETE");
    });

    it("When deleting pages Then the page list is reloaded", () => {
        service.deletePage(deletePageResponse.deletedPageId);

        request = httpMock.expectOne(ExpectedDeletePageCall);
        request.flush(deletePageResponse);

        request = httpMock.expectOne(pagesUrl);
        expect(request.request.method).toEqual("GET");
    });

    it("Can update page field", () => {
        service.updatePageField(fieldToSet, updatePageParams.pages, updatePageParams.newValue);

        request = httpMock.expectOne(ExpectedUpdatePageCall);
        expect(request.request.method).toEqual("PUT");
        expect(request.request.body).toEqual(updatePageParams);
    });

    it("When updating pages Then the page list is reloaded", () => {
        service.updatePageField(fieldToSet, updatePageParams.pages, updatePageParams.newValue);
        httpMock.expectOne(ExpectedUpdatePageCall).flush(response);

        request = httpMock.expectOne(pagesUrl);
        expect(request.request.method).toEqual("GET");
    });

    /***********************************************************************************************
     * Devices
     ***********************************************************************************************/
    it("When it reads devices and they are not queried Then they are queried", () => {
        const devices = service.devices;

        request = httpMock.expectOne(devicesUrl);
        expect(request.request.method).toEqual("GET");
        expect(devices.length).toBe(0);
    });

    it("When it reads the devices while they are queried Then they are not queried again", () => {
        let devices = service.devices;
        request = httpMock.expectOne(devicesUrl);
        devices = service.devices;

        httpMock.expectNone(devicesUrl);
        expect(devices.length).toBe(0);
    });

    it("When it read the the devices if the query fails the log service is called", () => {
        const devices = service.devices;
        httpMock.expectOne(devicesUrl).flush(data, mockErrorResponse);

        expect(logService.error).toHaveBeenCalled();
    });

    it("When it reads the devices after a query failed Then they are queried again", () => {
        let devices = service.devices;
        httpMock.expectOne(devicesUrl).flush(data, mockErrorResponse);
        devices = service.devices;

        request = httpMock.expectOne(devicesUrl);
        expect(devices.length).toBe(0);
    });

    it("When read devices Then the ones from the backend are read", () => {
        let devices = service.devices;
        request = httpMock.expectOne(devicesUrl);
        request.flush(expectedDevices);
        devices = service.devices;

        expect(devices).toEqual(expectedDevices);
    });

    it("Can add devices", () => {
        service.addNewDevice();

        request = httpMock.expectOne(devicesUrl);
        expect(request.request.method).toEqual("PUT");
    });

    it("When adding devices Then the device list is reloaded", () => {
        service.addNewDevice();
        httpMock.expectOne(devicesUrl).flush(response);

        request = httpMock.expectOne(devicesUrl);
        expect(request.request.method).toEqual("GET");
    });

    it("Can delete devices", () => {
        service.deleteDevice(deleteDeviceResponse.deletedDeviceId);

        request = httpMock.expectOne(expectedDeleteDeviceCall);
        expect(request.request.method).toEqual("DELETE");
    });

    it("When deleting devices Then the device list is reloaded", () => {
        service.deleteDevice(deleteDeviceResponse.deletedDeviceId);
        httpMock.expectOne(expectedDeleteDeviceCall).flush(deleteDeviceResponse);

        request = httpMock.expectOne(devicesUrl);
        expect(request.request.method).toEqual("GET");
    });

    it("Can update device name", () => {
        service.updateDeviceName(ExpectedDeviceId, ExpectedDeviceValue);

        request = httpMock.expectOne(ExpectedUpdateDeviceCall);
        expect(request.request.method).toEqual("PUT");
        expect(request.request.body).toEqual(ExpectedParams);
    });

    it("When Updating name then the devices are reloaded", () => {
        service.updateDeviceName(ExpectedDeviceId, ExpectedDeviceValue);
        httpMock.expectOne(ExpectedUpdateDeviceCall).flush(response);

        request = httpMock.expectOne(devicesUrl);
        expect(request.request.method).toEqual("GET");
    });

    it("When reading capabilities for the first time Then they are got from the model", () => {
        const capabilities = service.getCapabilities(PageFields.PageSize);

        request = httpMock.expectOne(ExpectedCapabilitiesCall);
        expect(capabilities.length).toBe(0);
    });

    it("When reading capabilities after the first time and before the model responds" +
        "Then they are'nt got from the model", () => {
        let capabilities = service.getCapabilities(PageFields.PageSize);
        request = httpMock.expectOne(ExpectedCapabilitiesCall);
        capabilities = service.getCapabilities(PageFields.PageSize);

        httpMock.expectNone(ExpectedCapabilitiesCall);
        expect(capabilities.length).toBe(0);
    });

    it("Can read device page options", () => {
        const devicePageOptionsResponse: ISelectableOption[] = [
            { value: "0", label: "label0 "}
        ];

        let capabilities = service.getCapabilities(PageFields.PageSize);
        request = httpMock.expectOne(`${deviceOptionsUrl}${PageFields.PageSize}`);
        request.flush(devicePageOptionsResponse);
        capabilities = service.getCapabilities(PageFields.PageSize);

        expect(capabilities).toEqual(devicePageOptionsResponse);
    });
});
