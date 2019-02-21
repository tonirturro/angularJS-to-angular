import * as angular from "angular";
import { IAugmentedJQuery, ICompileService, IRootScopeService } from "angular";

enum ButtonPosition {
    AddDevice, EditDevice, EditPages, Settings, Close
}

describe("Given a toolbar component", () => {
    let element: IAugmentedJQuery;
    let rootScope: IRootScopeService;
    let addButtonClick: boolean;
    let settingsButtonClick: boolean;
    let closeButtonClick: boolean;
    let editDevicesButtonClick: boolean;
    let editPagesButtonClick: boolean;
    let scope: any;

    beforeEach(angular.mock.module("myApp.components"));

    beforeEach(inject((
        $compile: ICompileService,
        $rootScope: IRootScopeService) => {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        scope.editingDevices = false;
        scope.addButton = () => {
            addButtonClick = true;
        };
        scope.settings = () => {
            settingsButtonClick = true;
        };
        scope.close = () => {
            closeButtonClick = true;
        };
        scope.editDevices = () => {
            editDevicesButtonClick = true;
        };
        scope.editPages = () => {
            editPagesButtonClick = true;
        };
        element = angular.element(`<toolbar ` +
                                    `editing-devices="editingDevices" ` +
                                    `on-add-device="addButton()" ` +
                                    `on-edit-devices="editDevices()" ` +
                                    `on-edit-pages="editPages()" ` +
                                    `on-settings="settings()" ` +
                                    `on-close="close()" />`);
        element = $compile(element)(scope);
        rootScope.$apply();
    }));

    it("When created Then it has the html defined", () => {
        expect(element.html).toBeDefined();
    });

    it("When clicking on add device button Then the action is reported", () => {
        addButtonClick = false;
        const addButton = element.find("button")[ButtonPosition.AddDevice];
        addButton.click();

        expect(addButtonClick).toBeTruthy();
    });

    it("When clicking on edit devices button and whe are editing pages Then the action is reported", () => {
        scope.editingDevices = false;
        editDevicesButtonClick = false;
        const editDevicesButton = element.find("button")[ButtonPosition.EditDevice];
        rootScope.$apply();
        editDevicesButton.click();

        expect(editDevicesButtonClick).toBeTruthy();
    });

    it("When clicking on edit devices button and whe are editing devices Then the action is not reported", () => {
        scope.editingDevices = true;
        editDevicesButtonClick = false;
        const editDevicesButton = element.find("button")[ButtonPosition.EditDevice];
        rootScope.$apply();
        editDevicesButton.click();

        expect(editDevicesButtonClick).toBeFalsy();
    });

    it("When clicking on edit pages button and whe are editing devices Then the action is reported", () => {
        scope.editingDevices = true;
        editPagesButtonClick = false;
        const editPagesButton = element.find("button")[ButtonPosition.EditPages];
        rootScope.$apply();
        editPagesButton.click();

        expect(editPagesButtonClick).toBeTruthy();
    });

    it("When clicking on edit pages button and whe are editind pages Then the action not is reported", () => {
        scope.editingDevices = false;
        editPagesButtonClick = false;
        const editPagesButton = element.find("button")[ButtonPosition.EditPages];
        rootScope.$apply();
        editPagesButton.click();

        expect(editPagesButtonClick).toBeFalsy();
    });

    it("When clicking on settings button Then the action is reported", () => {
        settingsButtonClick = false;
        const settingsButton = element.find("button")[ButtonPosition.Settings];
        settingsButton.click();

        expect(settingsButtonClick).toBeTruthy();
    });

    it("When clicking on close button Then the action is reported", () => {
        closeButtonClick = false;
        const closeButton = element.find("button")[ButtonPosition.Close];
        closeButton.click();

        expect(closeButtonClick).toBeTruthy();
    });
});
