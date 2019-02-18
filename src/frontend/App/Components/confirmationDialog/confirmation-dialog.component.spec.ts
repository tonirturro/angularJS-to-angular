import * as angular from "angular";
import { IAugmentedJQuery, ICompileService, IRootScopeService } from "angular";
import { IDialogParam, IMessageParam } from "../definitions";

describe("Given a confirmation dialog component", () => {
    let scope: any;
    let element: IAugmentedJQuery;
    let closed: boolean;
    let dismissed: boolean;

    beforeEach(angular.mock.module("myApp.components"));

    beforeEach(inject((
        $compile: ICompileService,
        $rootScope: IRootScopeService) => {
        scope = $rootScope.$new();
        scope.message = "Message";
        scope.resolve = {
            params: {
                message: "Message"
            }
        } as IDialogParam<IMessageParam>;
        scope.close = () => {
            closed = true;
        };
        scope.dismiss = () => {
            dismissed = true;
        };
        element = angular.element(`<confirmation-dialog resolve="resolve" close="close()" dismiss="dismiss()" />`);
        element = $compile(element)(scope);
        $rootScope.$apply();
    }));

    it("When created Then it has the html defined", () => {
        expect(element.html().includes("modal-body")).toBeTruthy();
    });

    it("When created Then it contains the message at h2 header", () => {
        expect(element.find("h2").eq(0).text()).toEqual(scope.resolve.params.message);
    });

    it("When clicking on first button Then the close method is called", () => {
        const firstButton = element.find("button").eq(0);

        firstButton.click();

        expect(closed).toBeTruthy();
    });

    it("When clicking on second button Then the close method is called", () => {
        const secondButton = element.find("button").eq(1);

        secondButton.click();

        expect(dismissed).toBeTruthy();
    });
});
