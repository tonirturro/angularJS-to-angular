import * as angular from "angular";
import { IAugmentedJQuery, ICompileService, IRootScopeService } from "angular";
import { IDevice } from "../../../../common/rest";
import { IDataService } from "../../Services/definitions";

describe("Given a device edit component", () => {
    const Devices: IDevice[] = [
        { id: 0, name: "Device 1" }
    ];
    let dataServiceToMock: IDataService;
    let rootScope: IRootScopeService;
    let scope: any;
    let element: IAugmentedJQuery;

    beforeEach(angular.mock.module("myApp.components"));

    beforeEach(inject((
        dataService: IDataService,
        $compile: ICompileService,
        $rootScope: IRootScopeService) => {
        dataServiceToMock = dataService;
        rootScope = $rootScope;
        scope = $rootScope.$new();
        scope.selectedDeviceID = Devices[0].id.toString();
        spyOnProperty(dataServiceToMock, "devices", "get").and.returnValue(Devices);
        element = angular.element(`<device-edit selected-device-id="selectedDeviceID" />`);
        element = $compile(element)(scope);
        rootScope.$apply();
    }));

    it("When created Then it has the html defined", () => {
        expect(element.html).toBeDefined();
    });

    it("When clicking on the apply button it stored the edited name", () => {
        spyOn(dataServiceToMock, "updateDeviceName");
        const button = element.find("button")[0];

        button.click();

        expect(dataServiceToMock.updateDeviceName).toHaveBeenCalledWith(Devices[0].id, Devices[0].name);
    });
});
