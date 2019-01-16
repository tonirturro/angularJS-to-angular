import { TestBed } from "@angular/core/testing";
import { IProvideService } from "@angular/upgrade/static/src/common/angular1";

import { IAugmentedJQuery, ICompileService, IRootScopeService} from "angular";
import * as angular from "angular";

import { IDevice } from "../../../../common/rest";
import { IStateService } from "../../Routes/ui-routes";
import { AppServicesModule } from "../../Services";
import { DataService } from "../../Services/data.service";
import { IDataService } from "../../Services/definitions";

describe("Given a delete device dialog component", () => {
    const deviceList: IDevice[] = [
        { id: 0, name: "Device Name" }
    ];
    let element: IAugmentedJQuery;
    let state: IStateService;
    let dataServiceToMock: IDataService;
    let scope: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ AppServicesModule ]
        });
    });

    beforeEach(angular.mock.module("myApp.components", ($provide: IProvideService) => {
        $provide.value("dataService", TestBed.get(DataService));
    }));

    beforeEach(inject((
        $compile: ICompileService,
        $rootScope: IRootScopeService,
        $state: IStateService,
        dataService: IDataService) => {
        state = $state;
        dataServiceToMock = dataService;
        spyOnProperty(dataServiceToMock, "devices", "get").and.returnValue(deviceList);
        scope = $rootScope.$new();
        scope.resolve = {
            params: {
                id: 0
            }
        };
        element = angular.element(`<delete-device-dialog resolve="resolve" />`);
        element = $compile(element)(scope);
        $rootScope.$apply();
    }));

    it("When created Then it has the html defined", () => {
        expect(element.html).toBeDefined();
    });

    it("When created Then it displays the device name", () => {
        const text = element.find("h2").eq(0).text();

        expect(text).toContain(deviceList[0].name);
    });

    it("When clicking the first button Then the device is deleted and the dialog is closed", () => {
        spyOn(state, "go");
        spyOn(dataServiceToMock, "deleteDevice");
        const firstButton = element.find("button")[0];

        firstButton.click();

        expect(dataServiceToMock.deleteDevice).toHaveBeenCalledWith(scope.resolve.params.id);
        expect(state.go).toHaveBeenCalledWith("^");
    });

    it("When clicking the second button Then the dialog is closed", () => {
        spyOn(state, "go");
        const secondButton = element.find("button")[1];

        secondButton.click();

        expect(state.go).toHaveBeenCalledWith("^");
    });
});
