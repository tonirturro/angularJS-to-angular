import * as angular from "angular";
import { IHttpBackendService, IHttpService, IQService, IRootScopeService } from "angular";
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
import { IDataService } from "./definitions";

describe("Given a data service", () => {
        const restUrl = "http://localhost:3000/REST";
        const pagesUrl = `${restUrl}/pages/`;
        const devicesUrl = `${restUrl}/devices/`;
        const deviceOptionsUrl = `${restUrl}/deviceOptions/`;
        const devicesResponse: { data: IDevice[] } = {
            data: [{
                id: 1,
                name: "Device 2"
            }]
        };
        const deleteDeviceResponse: { data: IDeleteDeviceResponse } = {
            data: { deletedDeviceId: 1, success: true }
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
        const updateParams = { pages: [10], newValue: "0" } as IUpdateParams;

        /**
         * Common test resources
         */
        const SelectedDeviceId = 1;
        let service: IDataService;
        let httpBackend: IHttpBackendService;
        let http: IHttpService;
        let q: IQService;
        let rootscope: IRootScopeService;

        /**
         * Initialize test environment
         */
        beforeEach(angular.mock.module("myApp.services"));

        beforeEach(inject((
                dataService: IDataService,
                $rootScope: IRootScopeService,
                $q: IQService,
                $http: IHttpService,
                $httpBackend: IHttpBackendService) => {
            service = dataService;
            rootscope = $rootScope;
            q = $q;
            httpBackend = $httpBackend;
            http = $http;
            httpBackend.whenGET(pagesUrl).respond(200, expectedPages);
        }));

        /**
         *
         * The test cases
         *
         */

         /************************************************************************
          * Pages
          ************************************************************************/
        it("When is working Then it exposes the available pages", () => {
            let pages = service.pages;
            httpBackend.flush();
            pages = service.pages;

            expect(pages.length).toBe(expectedPages.length);
        });

        it("Can add pages", () => {
            spyOn(http, "post").and.returnValue(q.resolve());

            service.addNewPage(SelectedDeviceId);

            expect(http.post).toHaveBeenCalledWith(`${pagesUrl}${SelectedDeviceId}`, {});
        });

        it("When adding pages Then it refreshes the page list", () => {
            spyOn(http, "post").and.returnValue(q.resolve({ data: response }));
            spyOn(http, "get").and.returnValue(q.resolve({ data: expectedPages }));

            service.addNewPage(SelectedDeviceId);
            rootscope.$apply();

            expect(http.get).toHaveBeenCalledWith(pagesUrl);
        });

        it("Can delete pages", () => {
            const ExpectedCall = `${pagesUrl}${deletePageResponse.deletedPageId}`;
            spyOn(http, "delete").and.returnValue(q.resolve());

            service.deletePage(deletePageResponse.deletedPageId);

            expect(http.delete).toHaveBeenCalledWith(ExpectedCall);
        });

        it("When deleting pages Then the page list is reloaded", () => {
            spyOn(http, "delete").and.returnValue(q.resolve({ data: deletePageResponse }));
            spyOn(http, "get").and.returnValue(q.resolve({ data: expectedPages }));

            service.deletePage(deletePageResponse.deletedPageId);
            rootscope.$apply();

            expect(http.get).toHaveBeenCalledWith(pagesUrl);
        });

        it("Can update page field", () => {
            const fieldToSet = "anyField";
            const ExpectedCall = `${pagesUrl}${fieldToSet}`;
            spyOn(http, "put").and.returnValue(q.resolve());

            service.updatePageField(fieldToSet, updateParams.pages, updateParams.newValue);

            expect(http.put).toHaveBeenCalledWith(ExpectedCall, JSON.stringify(updateParams));
        });

        it("When updating pages Then the page list is reloaded", () => {
            const fieldToSet = "anyField";
            spyOn(http, "put").and.returnValue(q.resolve({ data: response }));
            spyOn(http, "get").and.returnValue(q.resolve({ data: expectedPages }));

            service.updatePageField(fieldToSet, updateParams.pages, updateParams.newValue);
            rootscope.$apply();

            expect(http.get).toHaveBeenCalledWith(pagesUrl);
        });

        /***********************************************************************************************
         * Devices
         ***********************************************************************************************/
        it("When it reads devices and they are not queried Then they are queried", () => {
            spyOn(http, "get").and.returnValue(q.resolve(devicesResponse));

            const devices = service.devices;

            expect(devices.length).toBe(0);
            expect(http.get).toHaveBeenCalledWith(devicesUrl);
        });

        it("When it reads the devices while they are queried Then they are not queried again", () => {
            const getSpy = spyOn(http, "get");
            getSpy.and.returnValue(q.resolve(devicesResponse));

            let devices = service.devices;
            getSpy.calls.reset();
            devices = service.devices;

            expect(devices.length).toBe(0);
            expect(http.get).not.toHaveBeenCalled();
        });

        it("When it reads the devices after a query failed Then they are queried again", () => {
            const getSpy = spyOn(http, "get");
            getSpy.and.returnValue(q.reject({}));

            let devices = service.devices;
            rootscope.$apply();
            getSpy.calls.reset();
            devices = service.devices;

            expect(devices.length).toBe(0);
            expect(http.get).toHaveBeenCalledWith(devicesUrl);
        });

        it("When read devices Then the ones from the backend are read", () => {
            spyOn(http, "get").and.returnValue(q.resolve(devicesResponse));

            let devices = service.devices;
            rootscope.$apply();
            devices = service.devices;
            expect(devices).toEqual(devicesResponse.data);
        });

        it("Can add devices", () => {
            spyOn(http, "put").and.returnValue(q.resolve({ data: response }));

            service.addNewDevice();

            expect(http.put).toHaveBeenCalledWith(devicesUrl, {});
        });

        it("When adding devices Then the device list is reloaded", () => {
            spyOn(http, "put").and.returnValue(q.resolve({ data: response }));
            spyOn(http, "get").and.returnValue(q.resolve(devicesResponse));

            service.addNewDevice();
            rootscope.$apply();

            expect(http.get).toHaveBeenCalledWith(devicesUrl);
        });

        it("Can delete devices", () => {
            const expectedCall = `${devicesUrl}${deleteDeviceResponse.data.deletedDeviceId}`;
            spyOn(http, "delete").and.returnValue(q.resolve(deleteDeviceResponse));

            service.deleteDevice(deleteDeviceResponse.data.deletedDeviceId);

            expect(http.delete).toHaveBeenCalledWith(expectedCall);
        });

        it("When deleting devices Then the device list is reloaded", () => {
            spyOn(http, "delete").and.returnValue(q.resolve(deleteDeviceResponse));
            spyOn(http, "get").and.returnValue(q.resolve(devicesResponse));

            service.deleteDevice(deleteDeviceResponse.data.deletedDeviceId);
            rootscope.$apply();

            expect(http.get).toHaveBeenCalledWith(devicesUrl);
        });

        it("Can update device name", () => {
            const ExpectedId = 1;
            const ExpectedValue = "any";
            const ExpectedCall = `${devicesUrl}name/`;
            const ExpectedParams = JSON.stringify({ id: ExpectedId, newValue: ExpectedValue } as IUpdateDeviceParams);
            spyOn(http, "put").and.returnValue(q.resolve());
            spyOn(http, "get").and.returnValue(q.resolve(devicesResponse));

            service.updateDeviceName(ExpectedId, ExpectedValue);

            expect(http.put).toHaveBeenCalledWith(ExpectedCall, ExpectedParams);
        });

        it("When Updating name then the devices are reloaded", () => {
            spyOn(http, "put").and.returnValue(q.resolve({ data: response }));
            spyOn(http, "get").and.returnValue((q.resolve(devicesResponse)));

            service.updateDeviceName(1, "any");
            rootscope.$apply();

            expect(http.get).toHaveBeenCalledWith(devicesUrl);
        });

        it ("When reading capabilities for the first time Then they are got from the model", () => {
            const ExpectedCall = `${deviceOptionsUrl}${PageFields.PageSize}`;
            spyOn(http, "get").and.returnValue(q.resolve({}));

            const capabilities = service.getCapabilities(PageFields.PageSize);

            expect(capabilities.length).toBe(0);
            expect(http.get).toHaveBeenCalledWith(ExpectedCall);
        });

        it ("When reading capabilities after the first time and before the model responds" +
            "Then they are'nt got from the model", () => {
            const ExpectedCall = `${deviceOptionsUrl}${PageFields.PageSize}`;
            const getSpy = spyOn(http, "get");
            getSpy.and.returnValue(q.resolve({}));

            let capabilities = service.getCapabilities(PageFields.PageSize);
            getSpy.calls.reset();
            capabilities = service.getCapabilities(PageFields.PageSize);

            expect(capabilities.length).toBe(0);
            expect(http.get).not.toHaveBeenCalled();
        });

        it("Can read device page options", () => {
            const devicePageOptionsResponse: ISelectableOption[] = [
                { value: "0", label: "label0 "}
            ];

            httpBackend.whenGET(`${deviceOptionsUrl}${PageFields.PageSize}`).respond(200, devicePageOptionsResponse);

            let capabilities = service.getCapabilities(PageFields.PageSize);
            httpBackend.flush();
            capabilities = service.getCapabilities(PageFields.PageSize);

            expect(capabilities).toEqual(devicePageOptionsResponse);
        });
    });
