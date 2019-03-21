import { TestBed } from "@angular/core/testing";
import { CustomMatchers } from "../../../../../test/CustomMatchers";
import { NgbTooltipWindowComponent } from "./tooltip.component.ng2";

describe("ngb-tooltip-window", () => {

  // Matchers
  beforeEach(() => {
    jasmine.addMatchers(CustomMatchers);
  });

  beforeEach(() => { TestBed.configureTestingModule({ declarations: [NgbTooltipWindowComponent] }); });

  it("should render tooltip on top by default", () => {
    const fixture = TestBed.createComponent(NgbTooltipWindowComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement).toHaveCssClass("tooltip");
    expect(fixture.nativeElement).toHaveCssClass("bs-tooltip-top");
    expect(fixture.nativeElement.getAttribute("role")).toBe("tooltip");
  });

  it("should position tooltips as requested", () => {
    const fixture = TestBed.createComponent(NgbTooltipWindowComponent);
    fixture.componentInstance.placement = "left";
    fixture.detectChanges();
    expect(fixture.nativeElement).toHaveCssClass("bs-tooltip-left");
  });

  it("should optionally have a custom class", () => {
    const fixture = TestBed.createComponent(NgbTooltipWindowComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement).not.toHaveCssClass("my-custom-class");

    fixture.componentInstance.tooltipClass = "my-custom-class";
    fixture.detectChanges();

    expect(fixture.nativeElement).toHaveCssClass("my-custom-class");
  });
});
