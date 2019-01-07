import * as angular from "angular";
import { IAugmentedJQuery, ICompileService, IQService, IRootScopeService } from "angular";
import { IDevice } from "../../../../common/rest";

describe("Given a device panel component", () => {
    const InitialDevices: IDevice[] = [
        { id: 0, name: "Device 1" },
        { id: 1, name: "Device 2" },
        { id: 2, name: "Device 3" }
    ];
    let element: IAugmentedJQuery;
    let scope: {
        selectedDeviceId: number,
        selectDevice: (id: number) => void
    } | any;
    let reportedSelectedDeviceId: number;
    let reportedDeletedDeviceId: number;
    let rootScope: IRootScopeService;

    beforeEach(angular.mock.module("myApp.components"));

    beforeEach(inject((
        $compile: ICompileService,
        $rootScope: IRootScopeService) => {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        scope.devices = InitialDevices;
        scope.selectedDeviceId = -1;
        reportedSelectedDeviceId = -1;
        reportedDeletedDeviceId = -1;
        scope.selectDevice = (deviceId: number) => {
            reportedSelectedDeviceId = deviceId;
        };
        scope.deleteDevice = (deviceId: number) => {
            reportedDeletedDeviceId = deviceId;
        };
        element =
            angular.element(`<device-panel ` +
                            `devices="devices" `  +
                            `selected-device-id="selectedDeviceId" ` +
                            `on-selected-device="selectDevice(deviceId)"` +
                            `on-delete-device="deleteDevice(deviceId)" />`);
        element = $compile(element)(scope);
        rootScope.$apply();
    }));

    it("When created Then it has the html defined", () => {
        expect(element.html).toBeDefined();
    });

    it("When created Then it has the devices set by the model", () => {
        expect(element.find("tbody").find("tr").length).toBe(InitialDevices.length);
    });

    it("When created Then it has not selected devices", () => {
        const devices = element.find("tbody").find("tr");
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < devices.length; index++) {
            expect(devices[index].classList.contains("item-selected")).toBeFalsy();
        }
    });

    it("When a device is selected Then only this is showed as seleted", () => {
        const devices = element.find("tbody").find("tr").find("td");
        const selectedItem = 0;
        scope.selectedDeviceId = InitialDevices[selectedItem].id;
        rootScope.$apply();

        for (let index = 0; index < devices.length; index++) {
            if (index === selectedItem) {
                expect(devices[index].classList.contains("item-selected")).toBeTruthy();
            } else {
                expect(devices[index].classList.contains("item-selected")).toBeFalsy();
            }
        }

    });

    it("When clicking on a device Then its selection is reported", () => {
        const selectedItem = 1;
        const device = element.find("tbody").find("tr").find("td")[selectedItem];
        device.click();

        expect(reportedSelectedDeviceId).toEqual(InitialDevices[selectedItem].id);
    });

    it("When clicking on a device delete button Then its deletion is reported", () => {
        const selectedItem = 0;
        const device = element.find("tbody").find("tr").find("td").find("button")[selectedItem];
        device.click();

        expect(reportedDeletedDeviceId).toEqual(InitialDevices[selectedItem].id);
    });
});
