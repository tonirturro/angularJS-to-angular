import * as angular from "angular";
import { IAugmentedJQuery, ICompileService, IRootScopeService } from "angular";
import { ELanguages, IDialogParam, ILanguageParam } from "../definitions";

describe("Given a confirmation dialog component", () => {
    let scope: any;
    let element: IAugmentedJQuery;
    let closedResult: ELanguages;
    let dismissed: boolean;

    beforeEach(angular.mock.module("myApp.components"));

    beforeEach(inject((
        $compile: ICompileService,
        $rootScope: IRootScopeService) => {
        scope = $rootScope.$new();
        scope.resolve = {
            params: {
                language: ELanguages.Klingon
            }
        } as IDialogParam<ILanguageParam>;
        scope.close = (result: ELanguages) => {
            closedResult = result;
        };
        scope.dismiss = () => {
            dismissed = true;
        };
        element = angular.element(`<settings-dialog resolve="resolve" close="close($value)" dismiss="dismiss()" />`);
        element = $compile(element)(scope);
        $rootScope.$apply();
    }));

    it("When created Then it has the html defined", () => {
        expect(element.html().includes("modal-body")).toBeTruthy();
    });

    it("When clicking on first button Then the close method is called", () => {
        const firstButton = element.find("button").eq(0);

        firstButton.click();

        expect(closedResult).toEqual(scope.resolve.params.language);
    });

    it("When clicking on second button Then the close method is called", () => {
        const secondButton = element.find("button").eq(1);

        secondButton.click();

        expect(dismissed).toBeTruthy();
    });
});
