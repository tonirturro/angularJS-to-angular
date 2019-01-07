import * as angular from "angular";
import { IAugmentedJQuery, IDocumentService } from "angular";
import { IPositionService } from "../definitions";

describe("Given uibPosition service", () => {
  class TargetElMock {
    private width: number;
    private height: number;

    constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
    }

    public prop(propName: string): number {
      return propName === "offsetWidth" ? this.width : this.height;
    }
  }

  let documentService: IDocumentService;
  let uibPosition: IPositionService;

  beforeEach(angular.mock.module("ui-lib"));

  beforeEach(inject(($document: IDocumentService, $uibPosition: IPositionService) => {
    documentService = $document;
    uibPosition = $uibPosition;
  }));

  beforeEach(() => {
    jasmine.addMatchers({
      toBePositionedAt: (util, customEqualityTesters) => {
        return {
          compare: (actual, top, left) => {
            const result = {
              message: undefined,
              pass: util.equals(actual.top, top, customEqualityTesters) &&
                util.equals(actual.left, left, customEqualityTesters),
            };

            if (result.pass) {
              result.message =
                `Expected "(${actual.top}, ${actual.left})" not to be positioned at (${top}, ${left})`;
            } else {
              result.message =
                `Expected "(${actual.top}, ${actual.left})" to be positioned at (${top}, ${left})`;
            }

            return result;
          }
        };
      }
    });
  });

  describe("Then the rawnode", () => {
    it("returns the raw DOM element from an angular element", () => {
      const angularEl = angular.element("<div></div>");
      const el = uibPosition.getRawNode(angularEl) as HTMLElement;
      expect(el.nodeName).toBe("DIV");
    });

    it("returns the raw DOM element from a select element", () => {
      const angularEl = angular.element('<select><option value="value">value</option></select>');
      const el = uibPosition.getRawNode(angularEl) as HTMLElement;
      expect(el.nodeName).toBe("SELECT");
    });
  });

  describe("then the offset", () => {
    it("returns getBoundingClientRect by default", () => {
      const el = angular.element("<div>Foo</div>");

      /* getBoundingClientRect values will be based on the testing Chrome window
       so that makes this tests very brittle if we don't mock */
      spyOn(el[0], "getBoundingClientRect").and.returnValue({
        height: 100,
        left: 2,
        top: 2,
        width: 100,
      });
      documentService.find("body").append(el);

      const offset = uibPosition.offset(el);

      expect(offset).toEqual({
        height: 100,
        left: 2,
        top: 2,
        width: 100,
      });

      el.remove();
    });
  });

  describe("Given the viewportOffset", () => {
    let el: IAugmentedJQuery;

    beforeEach(() => {
      el = angular.element(
        '<div id="outer" ' +
        ' style="overflow: auto; width: 200px; height: 200px; padding: 25px; box-sizing: border-box;">' +
        '<div id="inner" ' +
        'style="margin: 20px; width: 100px; height: 100px; box-sizing: border-box;"></div></div>');
      documentService.find("body").append(el);
    });

    afterEach(() => {
      el.remove();
    });

    it("measures the offset", () => {
      const vpOffset = uibPosition.viewportOffset(document.getElementById("inner"));
      expect(vpOffset).toEqual({
        bottom: 30,
        left: 20,
        right: 30,
        top: 20
      });
    });

    it("measures the offset without padding", () => {
      const outerEl = document.getElementById("outer");
      outerEl.style.paddingTop = "0px";
      outerEl.style.paddingBottom = "0px";
      outerEl.style.paddingLeft = "0px";
      outerEl.style.paddingRight = "0px";

      const vpOffset = uibPosition.viewportOffset(document.getElementById("inner"));
      expect(vpOffset).toEqual({
        bottom: 80,
        left: 20,
        right: 80,
        top: 20
      });
    });

    it("measures the offset with borders", () => {
      const outerEl = document.getElementById("outer");
      outerEl.style.width = "220px";
      outerEl.style.height = "220px";
      outerEl.style.border = "10px solid black";

      const vpOffset = uibPosition.viewportOffset(document.getElementById("inner"));
      expect(vpOffset).toEqual({
        bottom: 30,
        left: 20,
        right: 30,
        top: 20
      });
    });

    it("measures the offset excluding padding", () => {
      const vpOffset = uibPosition.viewportOffset(document.getElementById("inner"), false, false);
      expect(vpOffset).toEqual({
        bottom: 55,
        left: 45,
        right: 55,
        top: 45,
      });
    });

    it("measures the offset when scrolled", () => {
      const innerEl = document.getElementById("inner");
      innerEl.style.width = "300px";
      innerEl.style.height = "300px";
      const outerEl = document.getElementById("outer");
      outerEl.scrollTop = 25;
      outerEl.scrollLeft = 25;

      const vpOffset = uibPosition.viewportOffset(document.getElementById("inner"));
      expect(vpOffset.top).toEqual(-5);
      expect(vpOffset.bottom).toBeGreaterThan(-180);
      expect(vpOffset.left).toEqual(-5);
      expect(vpOffset.right).toBeGreaterThan(-180);

      // brittle
      // expect(vpOffset).toEqual({
      //   top: -5,
      //   bottom: -162,
      //   left: -5,
      //   right: -162
      // });
    });
  });

  describe("Then position", () => {
    let el: IAugmentedJQuery;

    afterEach(() => {
      el.remove();
    });

    it("gets position with document as the relative parent", () => {
      el = angular.element("<div>Foo</div>");

      spyOn(el[0], "getBoundingClientRect").and.returnValue({
        height: 100,
        left: 2,
        top: 2,
        width: 100
      });

      documentService.find("body").append(el);

      const position = uibPosition.position(el);

      expect(position).toEqual({
        height: 100,
        left: 2,
        top: 2,
        width: 100
      });
    });

    it("gets position with an element as the relative parent", () => {
      el = angular.element('<div id="outer" style="position:relative;"><div id="inner">Foo</div></div>');

      documentService.find("body").append(el);

      const outerEl = angular.element(document.getElementById("outer"));
      const innerEl = angular.element(document.getElementById("inner"));

      spyOn(outerEl[0], "getBoundingClientRect").and.returnValue({
        height: 100,
        left: 2,
        top: 2,
        width: 100
      });
      spyOn(innerEl[0], "getBoundingClientRect").and.returnValue({
        height: 20,
        left: 5,
        top: 5,
        width: 20,
      });

      const position = uibPosition.position(innerEl);

      expect(position).toEqual({
        height: 20,
        left: 3,
        top: 3,
        width: 20,
      });
    });
  });

  describe("Then isScrollable", () => {
    let el: IAugmentedJQuery;

    afterEach(() => {
      el.remove();
    });

    it("should return true if the element is scrollable", () => {
      el = angular.element('<div style="overflow: auto"></div>');
      documentService.find("body").append(el);
      expect(uibPosition.isScrollable(el)).toBe(true);
    });

    it("should return false if the element is scrollable", () => {
      el = angular.element("<div></div>");
      documentService.find("body").append(el);
      expect(uibPosition.isScrollable(el)).toBe(false);
    });

  });

  describe("Then scrollParent", () => {
    let el: IAugmentedJQuery;

    afterEach(() => {
      el.remove();
    });

    it("gets the closest scrollable ancestor", () => {
      el = angular.element('<div id="outer" style="overflow: auto;"><div>Foo<div id="inner">Bar</div></div></div>');

      documentService.find("body").css({ overflow: "auto" }).append(el);

      const outerEl = document.getElementById("outer");
      const innerEl = document.getElementById("inner");

      const scrollParent = uibPosition.scrollParent(innerEl);
      expect(scrollParent).toEqual(outerEl);
    });

    it("gets the closest scrollable ancestor with overflow-x: scroll", () => {
      el = angular.element(
        '<div id="outer" style="overflow-x: scroll;">' +
        '<div>Foo<div id="inner">Bar</div></div></div>');

      documentService.find("body").css({ overflow: "auto" }).append(el);

      const outerEl = document.getElementById("outer");
      const innerEl = document.getElementById("inner");

      const scrollParent = uibPosition.scrollParent(innerEl);
      expect(scrollParent).toEqual(outerEl);
    });

    it("gets the closest scrollable ancestor with overflow-y: hidden", () => {
      el = angular.element(
        '<div id="outer" style="overflow-y: hidden;">' +
        '<div>Foo<div id="inner">Bar</div></div></div>');

      documentService.find("body").css({ overflow: "auto" }).append(el);

      const outerEl = document.getElementById("outer");
      const innerEl = document.getElementById("inner");

      const scrollParent = uibPosition.scrollParent(innerEl, true, false);
      expect(scrollParent).toEqual(outerEl);
    });

    it("gets the document element if no scrollable ancestor exists", () => {
      el = angular.element('<div id="outer"><div>Foo<div id="inner">Bar</div></div></div>');

      documentService.find("body").css({ overflow: "" }).append(el);

      const innerEl = document.getElementById("inner");

      const scrollParent = uibPosition.scrollParent(innerEl);
      expect(scrollParent).toEqual(documentService[0].documentElement);
    });

    it("gets the closest scrollable ancestor after a positioned ancestor when positioned absolute", () => {
      el = angular.element(
        '<div id="outer" style="overflow: auto; position: relative;">' +
        '<div style="overflow: auto;">Foo<div id="inner" style="position: absolute;">Bar</div></div></div>');

      documentService.find("body").css({ overflow: "auto" }).append(el);

      const outerEl = document.getElementById("outer");
      const innerEl = document.getElementById("inner");

      const scrollParent = uibPosition.scrollParent(innerEl);
      expect(scrollParent).toEqual(outerEl);
    });
  });

  describe("Then positionElements - append-to-body: false", () => {

    beforeEach(() => {
      // mock position info normally queried from the DOM
      uibPosition.position = () => {
        return {
          height: 20,
          left: 100,
          top: 100,
          width: 20
        };
      };
    });

    it("should position element on top-center by default", () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "other")).toBePositionedAt(90, 105);
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "top")).toBePositionedAt(90, 105);
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "top-center")).toBePositionedAt(90, 105);
    });

    it("should position on top-left", () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "top-left")).toBePositionedAt(90, 100);
    });

    it("should position on top-right", () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "top-right")).toBePositionedAt(90, 110);
    });

    it('should position elements on bottom-center when "bottom" specified', () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "bottom")).toBePositionedAt(120, 105);
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "bottom-center")).toBePositionedAt(120, 105);
    });

    it("should position elements on bottom-left", () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "bottom-left")).toBePositionedAt(120, 100);
    });

    it("should position elements on bottom-right", () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "bottom-right")).toBePositionedAt(120, 110);
    });

    it('should position elements on left-center when "left" specified', () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "left")).toBePositionedAt(105, 90);
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "left-center")).toBePositionedAt(105, 90);
    });

    it('should position elements on left-top when "left-top" specified', () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "left-top")).toBePositionedAt(100, 90);
    });

    it('should position elements on left-bottom when "left-bottom" specified', () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "left-bottom")).toBePositionedAt(110, 90);
    });

    it('should position elements on right-center when "right" specified', () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "right")).toBePositionedAt(105, 120);
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "right-center")).toBePositionedAt(105, 120);
    });

    it('should position elements on right-top when "right-top" specified', () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "right-top")).toBePositionedAt(100, 120);
    });

    it('should position elements on right-top when "right-top" specified', () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "right-bottom")).toBePositionedAt(110, 120);
    });
  });

  describe("Then positionElements - append-to-body: true", () => {
    beforeEach(() => {
      // mock offset info normally queried from the DOM
      uibPosition.offset = () => {
        return {
          height: 20,
          left: 100,
          top: 100,
          width: 20
        };
      };
    });

    it("should position element on top-center by default", () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "other", true)).toBePositionedAt(90, 105);
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "top", true)).toBePositionedAt(90, 105);
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "top-center", true)).toBePositionedAt(90, 105);
    });

    it("should position on top-left", () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "top-left", true)).toBePositionedAt(90, 100);
    });

    it("should position on top-right", () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "top-right", true)).toBePositionedAt(90, 110);
    });

    it('should position elements on bottom-center when "bottom" specified', () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "bottom", true)).toBePositionedAt(120, 105);
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "bottom-center", true)).toBePositionedAt(120, 105);
    });

    it("should position elements on bottom-left", () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "bottom-left", true)).toBePositionedAt(120, 100);
    });

    it("should position elements on bottom-right", () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "bottom-right", true)).toBePositionedAt(120, 110);
    });

    it('should position elements on left-center when "left" specified', () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "left", true)).toBePositionedAt(105, 90);
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "left-center", true)).toBePositionedAt(105, 90);
    });

    it('should position elements on left-top when "left-top" specified', () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "left-top", true)).toBePositionedAt(100, 90);
    });

    it('should position elements on left-bottom when "left-bottom" specified', () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "left-bottom", true)).toBePositionedAt(110, 90);
    });

    it('should position elements on right-center when "right" specified', () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "right", true)).toBePositionedAt(105, 120);
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "right-center", true)).toBePositionedAt(105, 120);
    });

    it('should position elements on right-top when "right-top" specified', () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "right-top", true)).toBePositionedAt(100, 120);
    });

    it('should position elements on right-bottom when "right-bottom" specified', () => {
      expect(uibPosition.positionElements(
        {} as any, new TargetElMock(10, 10) as any, "right-bottom", true)).toBePositionedAt(110, 120);
    });
  });

  describe("smart positioning", () => {
    let viewportOffset;
    let el: IAugmentedJQuery;

    beforeEach(() => {
      el = angular.element("<div></div>");
      documentService.find("body").append(el);

      // mock position info normally queried from the DOM
      uibPosition.position = () => {
        return {
          height: 40,
          left: 100,
          top: 100,
          width: 40
        };
      };

      viewportOffset = {
        bottom: 10,
        height: 10,
        left: 10,
        right: 10,
        top: 10,
        width: 10,
      };

      uibPosition.viewportOffset = () => {
        return viewportOffset;
      };
    });

    afterEach(() => {
      el.remove();
    });

    // tests primary top -> bottom
    // tests secondary left -> right
    it("should position element on bottom-right when top-left does not fit", () => {
      viewportOffset.bottom = 20;
      viewportOffset.left = 20;
      el.css({ width: "60px", height: "20px" });
      expect(uibPosition.positionElements({} as any, el, "auto top-left")).toBePositionedAt(140, 80);
    });

    // tests primary bottom -> top
    // tests secondary right -> left
    it("should position element on top-left when bottom-right does not fit", () => {
      viewportOffset.top = 20;
      viewportOffset.right = 20;
      el.css({ width: "60px", height: "20px" });
      expect(uibPosition.positionElements({} as any, el, "auto bottom-right")).toBePositionedAt(80, 100);
    });

    // tests primary left -> right
    // tests secondary top -> bottom
    it("should position element on right-bottom when left-top does not fit", () => {
      viewportOffset.top = 20;
      viewportOffset.right = 20;
      el.css({ width: "20px", height: "60px" });
      expect(uibPosition.positionElements({} as any, el, "auto left-top")).toBePositionedAt(80, 140);
    });

    // tests primary right -> left
    // tests secondary bottom -> top
    it("should position element on left-top when right-bottom does not fit", () => {
      viewportOffset.bottom = 20;
      viewportOffset.left = 20;
      el.css({ width: "20px", height: "60px" });
      expect(uibPosition.positionElements({} as any, el, "auto right-bottom")).toBePositionedAt(100, 80);
    });

    // tests vertical center -> top
    it("should position element on left-top when left-center does not fit vetically", () => {
      viewportOffset.bottom = 100;
      el.css({ width: "20px", height: "120px" });
      expect(uibPosition.positionElements({} as any, el, "auto left")).toBePositionedAt(100, 80);
    });

    // tests vertical center -> bottom
    it("should position element on left-bottom when left-center does not fit vertically", () => {
      viewportOffset.top = 100;
      el.css({ width: "20px", height: "120px" });
      expect(uibPosition.positionElements({} as any, el, "auto left")).toBePositionedAt(20, 80);
    });

    // tests horizontal center -> left
    it("should position element on top-left when top-center does not fit horizontally", () => {
      viewportOffset.right = 100;
      el.css({ width: "120px", height: "20px" });
      expect(uibPosition.positionElements({} as any, el, "auto top")).toBePositionedAt(80, 100);
    });

    // tests horizontal center -> right
    it("should position element on top-right when top-center does not fit horizontally", () => {
      viewportOffset.left = 100;
      el.css({ width: "120px", height: "20px" });
      expect(uibPosition.positionElements({} as any, el, "auto top")).toBePositionedAt(80, 20);
    });
  });
});
