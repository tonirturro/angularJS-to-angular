import * as angular from "angular";
import { IDirective } from "angular";
import { AnyCnameRecord } from "dns";

describe("uibModalTransclude", () => {
    let uibModalTranscludeDDO: any;
    let $animate: angular.animate.IAnimateService;

    beforeEach(angular.mock.module("ui-lib"));
    beforeEach(angular.mock.module(($provide: angular.auto.IProvideService) => {
        $animate = jasmine.createSpyObj("$animate", ["enter"]);
        $provide.value("$animate", $animate);
    }));

    beforeEach(inject((uibModalTranscludeDirective: IDirective) => {
        uibModalTranscludeDDO = uibModalTranscludeDirective[0];
    }));

    describe("when initialised", () => {
        let scope: any;
        let element: JQuery;
        let transcludeSpy: jasmine.Spy;
        let transcludeFn: (content: string) => void;

        beforeEach(() => {
            scope = {
                $parent: "parentScope"
            };

            element = jasmine.createSpyObj("containerElement", ["empty"]);
            transcludeSpy = jasmine.createSpy("transcludeSpy").and.callFake((scopeArg: any, fn: any) => {
                transcludeFn = fn;
            });

            uibModalTranscludeDDO.link(scope, element, {}, {}, transcludeSpy);
        });

        it("should call the transclusion function", () => {
            expect(transcludeSpy).toHaveBeenCalledWith(scope.$parent, jasmine.any(Function));
        });

        describe("transclusion callback", () => {
            let transcludedContent;

            beforeEach(() => {
                transcludedContent = "my transcluded content";
                transcludeFn(transcludedContent);
            });

            it("should empty the element", () => {
                expect(element.empty).toHaveBeenCalledWith();
            });

            it("should append the transcluded content", () => {
                expect($animate.enter).toHaveBeenCalledWith(transcludedContent, element);
            });
        });
    });
});
