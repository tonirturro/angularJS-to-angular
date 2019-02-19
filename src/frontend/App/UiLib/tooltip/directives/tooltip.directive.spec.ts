import { IAugmentedJQuery, ICompileService, IDocumentService, IRootScopeService, ITimeoutService } from "angular";
import * as angular from "angular";

describe("Given a tooltip directive", () => {
    let document: IDocumentService;
    let elmBody: IAugmentedJQuery;
    let scope: IRootScopeService;
    let elm: IAugmentedJQuery;
    let elmScope: any;
    let tooltipScope: any;
    let compile: ICompileService;
    let timeout: ITimeoutService;
    const trigger = (element: any, evt: any) => {
        element.trigger(evt);
        element.scope().$$childTail.$digest();
    };

    beforeEach(angular.mock.module("ui-lib"));

    beforeEach(inject((
        $rootScope: IRootScopeService,
        $compile: ICompileService,
        $document: IDocumentService,
        $timeout: ITimeoutService) => {
        compile = $compile;
        document = $document;
        timeout = $timeout;
        elmBody = angular.element(
          '<div><span uib-tooltip="tooltip text" tooltip-animation="false">Selector Text</span></div>'
        );

        scope = $rootScope;
        compile(elmBody)(scope);
        scope.$digest();
        elm = elmBody.find("span");
        elmScope = elm.scope();
        tooltipScope = elmScope.$$childTail;
      }));

    afterEach(() => {
        document.off("keyup");
    });

    it("should not be open initially", () => {
        expect(tooltipScope.isOpen).toBe(false);

        // We can only test *that* the tooltip-popup element wasn't created as the
        // implementation is templated and replaced.
        expect(elmBody.children().length).toBe(1);
    });

    it("should open on mouseenter", () => {
        trigger(elm, "mouseenter");
        expect(tooltipScope.isOpen).toBe(true);

        // We can only test *that* the tooltip-popup element was created as the
        // implementation is templated and replaced.
        expect(elmBody.children().length).toBe(2);
    });

    it("should close on mouseleave", () => {
        trigger(elm, "mouseenter");
        trigger(elm, "mouseleave");

        expect(tooltipScope.isOpen).toBe(false);
    });

    it('should have default placement of "top"', () => {
        trigger(elm, "mouseenter");
        expect(tooltipScope.placement).toBe("top");
    });

    it("should allow specification of placement", () => {
        elm = compile(angular.element(
          '<span uib-tooltip="tooltip text" tooltip-placement="bottom">Selector Text</span>'
        ))(scope);
        scope.$apply();
        elmScope = elm.scope();
        tooltipScope = elmScope.$$childTail;
        trigger(elm, "mouseenter");

        expect(tooltipScope.placement).toBe("bottom");
    });

    it("should update placement dynamically", () => {
        const elementScope = scope.$new() as any;
        elementScope.place = "bottom";
        elm = compile(angular.element(
          '<span uib-tooltip="tooltip text" tooltip-placement="{{place}}">Selector Text</span>'
        ))(elementScope);
        scope.$apply();
        elmScope = elm.scope();
        tooltipScope = elmScope.$$childTail;

        trigger(elm, "mouseenter");
        expect(tooltipScope.placement).toBe("bottom");

        elementScope.place = "right";
        scope.$digest();
        timeout.flush();
        expect(tooltipScope.placement).toBe("right");
    });

    it("should work inside an ngRepeat", () => {
        const elementScope = scope.$new() as any;
        elm = compile(angular.element(
          "<ul>" +
            '<li ng-repeat="item in items">' +
              '<span uib-tooltip="{{item.tooltip}}">{{item.name}}</span>' +
            "</li>" +
          "</ul>"
        ))(elementScope);

        elementScope.items = [
          { name: "One", tooltip: "First Tooltip" }
        ];

        scope.$digest();

        const tt = angular.element(elm.find("li > span")[0]) as any;
        trigger(tt, "mouseenter");

        expect(tt.text()).toBe(elementScope.items[0].name);

        tooltipScope = tt.scope().$$childTail;
        expect(tooltipScope.content).toBe(elementScope.items[0].tooltip);

        trigger(tt, "mouseleave");
        expect(tooltipScope.isOpen).toBeFalsy();
    });

    it("should show correct text when in an ngRepeat", () => {
        const elementScope = scope.$new() as any;
        elm = compile(angular.element(
          "<ul>" +
            '<li ng-repeat="item in items">' +
              '<span uib-tooltip="{{item.tooltip}}">{{item.name}}</span>' +
            "</li>" +
          "</ul>"
        ))(elementScope);

        elementScope.items = [
          { name: "One", tooltip: "First Tooltip" },
          { name: "Second", tooltip: "Second Tooltip" }
        ];

        scope.$digest();

        const tt1 = angular.element(elm.find("li > span")[0]) as any;
        const tt2 = angular.element(elm.find("li > span")[1]) as any;

        trigger(tt1, "mouseenter");
        trigger(tt1, "mouseleave");

        timeout.flush();

        trigger(tt2, "mouseenter");

        expect(tt1.text()).toBe(elementScope.items[0].name);
        expect(tt2.text()).toBe(elementScope.items[1].name);

        tooltipScope = tt2.scope().$$childTail;
        expect(tooltipScope.content).toBe(elementScope.items[1].tooltip);
        // expect(elm.find(".tooltip-inner").text()).toBe(elementScope.items[1].tooltip);

        trigger(tt2, "mouseleave");
    });

    it("should only have an isolate scope on the popup", () => {
        const elementScope = scope.$new() as any;
        let ttScope;

        elementScope.tooltipMsg = "Tooltip Text";
        elementScope.alt = "Alt Message";

        elmBody = compile(angular.element(
          '<div><span alt={{alt}} uib-tooltip="{{tooltipMsg}}" tooltip-animation="false">Selector Text</span></div>'
        ))(elementScope);

        compile(elmBody)(elementScope);
        scope.$digest();
        elm = elmBody.find("span");
        elmScope = elm.scope();

        trigger(elm, "mouseenter");
        expect(elm.attr("alt")).toBe(elementScope.alt);

        ttScope = angular.element(elmBody.children()[1]).isolateScope();
        expect(ttScope.content).toBe(elementScope.tooltipMsg);

        trigger(elm, "mouseleave");

        // Isolate scope contents should be the same after hiding and showing again (issue 1191)
        trigger(elm, "mouseenter");

        ttScope = angular.element(elmBody.children()[1]).isolateScope();
        expect(ttScope.content).toBe(elementScope.tooltipMsg);
    });

    it("should close the tooltip when its trigger element is destroyed", () => {
        trigger(elm, "mouseenter");
        expect(tooltipScope.isOpen).toBe(true);

        elm.remove();
        elmScope.$destroy();

        expect(elmBody.children().length).toBe(0);
    });
});
