import { IAugmentedJQuery, ICompileService, IRootScopeService, IWindowService } from "angular";
import * as angular from "angular";
import { IStateService } from "../../ui-routes";

describe("Given a toolbar component", () => {
    let element: IAugmentedJQuery;
    let window: IWindowService;
    let state: IStateService;

    beforeEach(angular.mock.module("myApp.components"));

    beforeEach(inject((
        $compile: ICompileService,
        $rootScope: IRootScopeService,
        $window: IWindowService,
        $state: IStateService) => {
        window = $window;
        state = $state;
        element = angular.element(`<close-dialog />`);
        element = $compile(element)($rootScope.$new());
        $rootScope.$apply();
    }));

    it("When created Then it has the html defined", () => {
        expect(element.html).toBeDefined();
    });

    it("When clicking the first button Then the main window is closed", () => {
        spyOn(window, "close");
        const firstButton = element.find("button")[0];

        firstButton.click();

        expect(window.close).toHaveBeenCalled();
    });

    it("When clicking the second button Then the dialog is closed", () => {
        spyOn(state, "go");
        const secondButton = element.find("button")[1];

        secondButton.click();

        expect(state.go).toHaveBeenCalledWith("^");
    });
});
