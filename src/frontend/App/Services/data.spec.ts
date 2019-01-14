import { HttpClientTestingModule, HttpTestingController, TestRequest } from "@angular/common/http/testing";
import { inject, TestBed } from "@angular/core/testing";

import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";

import { IDeletePageResponse, IDevice, IPage, IUpdateParams, IUpdateResponse } from "../../../common/rest";
import { Data } from "./data";

fdescribe("Given a data service", () => {
    const restUrl = "http://localhost:3000/REST";
    const pagesUrl = `${restUrl}/pages/`;
    const devicesUrl = `${restUrl}/devices/`;
    const fieldToSet = "anyField";
    const expectedDevices: IDevice[] = [{
            id: 1,
            name: "Device 2"
        }];
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
    const updateParams = { pages: [10], newValue: "0" } as IUpdateParams;
    const ExpectedDeleteCall = `${pagesUrl}${deletePageResponse.deletedPageId}`;
    const ExpectedUpdateCall = `${pagesUrl}${fieldToSet}`;

    const SelectedDeviceId = 1;

    let dataService: Data;
    let httpMock: HttpTestingController;
    let request: TestRequest;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [Data]
        });
    });

    beforeEach(inject(
        [Data, HttpTestingController], (
            service: Data,
            mock: HttpTestingController) => {
            dataService = service;
            httpMock = mock;
            request = null;
        }
    ));

    afterEach(() => {
        httpMock.verify();
    });

    /************************************************************************
     * Pages
     ************************************************************************/
    it("When is working Then it exposes the available pages", () => {
        let pages = dataService.pages;
        request = httpMock.expectOne(pagesUrl);
        request.flush(expectedPages);
        pages = dataService.pages;

        expect(request.request.method).toEqual("GET");
        expect(pages.length).toBe(expectedPages.length);
    });

    it("Can add pages", () => {
        dataService.addNewPage(SelectedDeviceId);

        request = httpMock.expectOne(`${pagesUrl}${SelectedDeviceId}`);
        expect(request.request.method).toEqual("POST");
    });

    it("When adding pages Then it refreshes the page list", () => {
        dataService.addNewPage(SelectedDeviceId);

        request = httpMock.expectOne(`${pagesUrl}${SelectedDeviceId}`);
        request.flush(response);

        request = httpMock.expectOne(pagesUrl);
        expect(request.request.method).toEqual("GET");
    });

    it("Can delete pages", () => {
        dataService.deletePage(deletePageResponse.deletedPageId);

        request = httpMock.expectOne(ExpectedDeleteCall);
        expect(request.request.method).toEqual("DELETE");
    });

    it("When deleting pages Then the page list is reloaded", () => {
        dataService.deletePage(deletePageResponse.deletedPageId);

        request = httpMock.expectOne(ExpectedDeleteCall);
        request.flush(deletePageResponse);

        request = httpMock.expectOne(pagesUrl);
        expect(request.request.method).toEqual("GET");
    });

    it("Can update page field", () => {
        dataService.updatePageField(fieldToSet, updateParams.pages, updateParams.newValue);

        request = httpMock.expectOne(ExpectedUpdateCall);
        expect(request.request.method).toEqual("PUT");
        expect(request.request.body).toEqual(updateParams);
    });

    it("When updating pages Then the page list is reloaded", () => {
        dataService.updatePageField(fieldToSet, updateParams.pages, updateParams.newValue);

        request = httpMock.expectOne(ExpectedUpdateCall);
        request.flush(response);

        request = httpMock.expectOne(pagesUrl);
        expect(request.request.method).toEqual("GET");
    });

    /***********************************************************************************************
     * Devices
     ***********************************************************************************************/
    it("When it reads devices and they are not queried Then they are queried", () => {
        const devices = dataService.devices;

        request = httpMock.expectOne(devicesUrl);
        expect(request.request.method).toEqual("GET");
        expect(devices.length).toBe(0);
    });

    it("When it reads the devices while they are queried Then they are not queried again", () => {
        const http = TestBed.get(HttpClient);
        const getSpy = spyOn(http, "get");
        getSpy.and.returnValue(of([]));

        let devices = dataService.devices;
        getSpy.calls.reset();
        devices = dataService.devices;

        expect(devices.length).toBe(0);
        expect(http.get).not.toHaveBeenCalled();
    });

    it("When it reads the devices after a query failed Then they are queried again", () => {
        const mockErrorResponse = { status: 400, statusText: "Bad Request" };
        const data = "Invalid request parameters";

        let devices = dataService.devices;
        request = httpMock.expectOne(devicesUrl);
        request.flush(data, mockErrorResponse);
        devices = dataService.devices;

        request = httpMock.expectOne(devicesUrl);
        expect(devices.length).toBe(0);
    });

    it("When read devices Then the ones from the backend are read", () => {
        let devices = dataService.devices;
        request = httpMock.expectOne(devicesUrl);
        request.flush(expectedDevices);
        devices = dataService.devices;

        expect(devices).toEqual(expectedDevices);
    });
});
