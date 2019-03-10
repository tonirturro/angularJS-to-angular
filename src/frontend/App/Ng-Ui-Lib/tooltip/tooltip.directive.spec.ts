import { ComponentFixture, TestBed } from "@angular/core/testing";

import { By } from "@angular/platform-browser";

import {
    ChangeDetectionStrategy,
    Component,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import { NgbTooltipConfig, NgbTooltipDirective, UserInterfaceLibModule } from "..";
import { CustomMatchers } from "../../../../../test/CustomMatchers";

function createGenericTestComponent<T>(html: string, type: new (...args: any[]) => T): ComponentFixture<T> {
    TestBed.overrideComponent(type, { set: { template: html } });
    const fixture = TestBed.createComponent(type);
    fixture.detectChanges();
    return fixture as ComponentFixture<T>;
}

const createTestComponent =
    (html: string) => createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
const createOnPushTestComponent =
    (html: string) => createGenericTestComponent(html, TestOnPushComponent) as ComponentFixture<TestOnPushComponent>;

describe("ngb-tooltip", () => {

    // Matchers
    beforeEach(() => {
        jasmine.addMatchers(CustomMatchers);
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent, TestOnPushComponent],
            imports: [UserInterfaceLibModule]
        });
    });

    function getWindow(element) { return element.querySelector("ngb-tooltip-window"); }

    describe("basic functionality", () => {

        it("should open and close a tooltip - default settings and content as string", () => {
            const fixture = createTestComponent(`<div ngbTooltip="Great tip!"></div>`);
            const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));
            const defaultConfig = new NgbTooltipConfig();

            directive.triggerEventHandler("mouseenter", {});
            fixture.detectChanges();
            const windowEl = getWindow(fixture.nativeElement);

            expect(windowEl).toHaveCssClass("tooltip");
            expect(windowEl).toHaveCssClass(`bs-tooltip-${defaultConfig.placement}`);
            expect(windowEl.textContent.trim()).toBe("Great tip!");
            expect(windowEl.getAttribute("role")).toBe("tooltip");
            expect(windowEl.getAttribute("id")).toBe("ngb-tooltip-0");
            expect(windowEl.parentNode).toBe(fixture.nativeElement);
            expect(directive.nativeElement.getAttribute("aria-describedby")).toBe("ngb-tooltip-0");

            directive.triggerEventHandler("mouseleave", {});
            fixture.detectChanges();
            expect(getWindow(fixture.nativeElement)).toBeNull();
            expect(directive.nativeElement.getAttribute("aria-describedby")).toBeNull();
        });

        it("should open and close a tooltip - default settings and content from a template", () => {
            const fixture =
                createTestComponent(
                    `<ng-template #t>Hello, {{name}}!</ng-template><div [ngbTooltip]="t"></div>`);
            const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

            directive.triggerEventHandler("mouseenter", {});
            fixture.detectChanges();
            const windowEl = getWindow(fixture.nativeElement);

            expect(windowEl).toHaveCssClass("tooltip");
            expect(windowEl).toHaveCssClass("bs-tooltip-top");
            expect(windowEl.textContent.trim()).toBe("Hello, World!");
            expect(windowEl.getAttribute("role")).toBe("tooltip");
            expect(windowEl.getAttribute("id")).toBe("ngb-tooltip-1");
            expect(windowEl.parentNode).toBe(fixture.nativeElement);
            expect(directive.nativeElement.getAttribute("aria-describedby")).toBe("ngb-tooltip-1");

            directive.triggerEventHandler("mouseleave", {});
            fixture.detectChanges();
            expect(getWindow(fixture.nativeElement)).toBeNull();
            expect(directive.nativeElement.getAttribute("aria-describedby")).toBeNull();
        });

        it("should open and close a tooltip - default settings, content from a template and context supplied", () => {
            const fixture =
                createTestComponent(
                    `<ng-template #t let-name="name">Hello, ` +
                    `{{name}}!</ng-template><div [ngbTooltip]="t"></div>`);
            const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

            directive.context.tooltip.open({ name: "John" });
            fixture.detectChanges();
            const windowEl = getWindow(fixture.nativeElement);

            expect(windowEl).toHaveCssClass("tooltip");
            expect(windowEl).toHaveCssClass("bs-tooltip-top");
            expect(windowEl.textContent.trim()).toBe("Hello, John!");
            expect(windowEl.getAttribute("role")).toBe("tooltip");
            expect(windowEl.getAttribute("id")).toBe("ngb-tooltip-2");
            expect(windowEl.parentNode).toBe(fixture.nativeElement);
            expect(directive.nativeElement.getAttribute("aria-describedby")).toBe("ngb-tooltip-2");

            directive.triggerEventHandler("mouseleave", {});
            fixture.detectChanges();
            expect(getWindow(fixture.nativeElement)).toBeNull();
            expect(directive.nativeElement.getAttribute("aria-describedby")).toBeNull();
        });

        it("should open and close a tooltip - default settings and custom class", () => {
            const fixture = createTestComponent(`
          <div ngbTooltip="Great tip!" tooltipClass="my-custom-class"></div>`);
            const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

            directive.triggerEventHandler("mouseenter", {});
            fixture.detectChanges();
            const windowEl = getWindow(fixture.nativeElement);

            expect(windowEl).toHaveCssClass("tooltip");
            expect(windowEl).toHaveCssClass("bs-tooltip-top");
            expect(windowEl).toHaveCssClass("my-custom-class");
            expect(windowEl.textContent.trim()).toBe("Great tip!");
            expect(windowEl.getAttribute("role")).toBe("tooltip");
            expect(windowEl.getAttribute("id")).toBe("ngb-tooltip-3");
            expect(windowEl.parentNode).toBe(fixture.nativeElement);
            expect(directive.nativeElement.getAttribute("aria-describedby")).toBe("ngb-tooltip-3");

            directive.triggerEventHandler("mouseleave", {});
            fixture.detectChanges();
            expect(getWindow(fixture.nativeElement)).toBeNull();
            expect(directive.nativeElement.getAttribute("aria-describedby")).toBeNull();
        });

        it("should not open a tooltip if content is falsy", () => {
            const fixture = createTestComponent(`<div [ngbTooltip]="notExisting"></div>`);
            const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

            directive.triggerEventHandler("mouseenter", {});
            fixture.detectChanges();
            const windowEl = getWindow(fixture.nativeElement);

            expect(windowEl).toBeNull();
        });

        it("should close the tooltip tooltip if content becomes falsy", () => {
            const fixture = createTestComponent(`<div [ngbTooltip]="name"></div>`);
            const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

            directive.triggerEventHandler("mouseenter", {});
            fixture.detectChanges();
            expect(getWindow(fixture.nativeElement)).not.toBeNull();

            fixture.componentInstance.name = null;
            fixture.detectChanges();
            expect(getWindow(fixture.nativeElement)).toBeNull();
        });

        it("should not open a tooltip if [disableTooltip] flag", () => {
            const fixture =
                createTestComponent(`<div [ngbTooltip]="Disabled!" [disableTooltip]="true"></div>`);
            const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

            directive.triggerEventHandler("mouseenter", {});
            fixture.detectChanges();
            const windowEl = getWindow(fixture.nativeElement);

            expect(windowEl).toBeNull();
        });

        it("should allow re-opening previously closed tooltips", () => {
            const fixture = createTestComponent(`<div ngbTooltip="Great tip!"></div>`);
            const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

            directive.triggerEventHandler("mouseenter", {});
            fixture.detectChanges();
            expect(getWindow(fixture.nativeElement)).not.toBeNull();

            directive.triggerEventHandler("mouseleave", {});
            fixture.detectChanges();
            expect(getWindow(fixture.nativeElement)).toBeNull();

            directive.triggerEventHandler("mouseenter", {});
            fixture.detectChanges();
            expect(getWindow(fixture.nativeElement)).not.toBeNull();
        });

        it("should not leave dangling tooltips in the DOM", () => {
            const fixture =
                createTestComponent(
                    `<ng-template [ngIf]="show"><div ngbTooltip="Great tip!"></div></ng-template>`);
            const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

            directive.triggerEventHandler("mouseenter", {});
            fixture.detectChanges();
            expect(getWindow(fixture.nativeElement)).not.toBeNull();

            fixture.componentInstance.show = false;
            fixture.detectChanges();
            expect(getWindow(fixture.nativeElement)).toBeNull();
        });

        it("should properly cleanup tooltips with manual triggers", () => {
            const fixture = createTestComponent(`
              <ng-template [ngIf]="show">
                <div
                    ngbTooltip="Great tip!"
                    triggers="manual"
                    #t="ngbTooltip"
                    (mouseenter)="t.open()">
                </div>
              </ng-template>`);
            const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

            directive.triggerEventHandler("mouseenter", {});
            fixture.detectChanges();
            expect(getWindow(fixture.nativeElement)).not.toBeNull();

            fixture.componentInstance.show = false;
            fixture.detectChanges();
            expect(getWindow(fixture.nativeElement)).toBeNull();
        });

        describe("positioning", () => {

            it("should use requested position", () => {
                const fixture = createTestComponent(`<div ngbTooltip="Great tip!" placement="left"></div>`);
                const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

                directive.triggerEventHandler("mouseenter", {});
                fixture.detectChanges();
                const windowEl = getWindow(fixture.nativeElement);

                expect(windowEl).toHaveCssClass("tooltip");
                expect(windowEl).toHaveCssClass("bs-tooltip-left");
                expect(windowEl.textContent.trim()).toBe("Great tip!");
            });

            it("should properly position tooltips when a component is using the OnPush strategy", () => {
                const fixture =
                    createOnPushTestComponent(`<div ngbTooltip="Great tip!" placement="left"></div>`);
                const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

                directive.triggerEventHandler("mouseenter", {});
                fixture.detectChanges();
                const windowEl = getWindow(fixture.nativeElement);

                expect(windowEl).toHaveCssClass("tooltip");
                expect(windowEl).toHaveCssClass("bs-tooltip-left");
                expect(windowEl.textContent.trim()).toBe("Great tip!");
            });

            it("should have proper arrow placement", () => {
                const fixture =
                    createTestComponent(`<div ngbTooltip="Great tip!" placement="right-top"></div>`);
                const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

                directive.triggerEventHandler("mouseenter", {});
                fixture.detectChanges();
                const windowEl = getWindow(fixture.nativeElement);

                expect(windowEl).toHaveCssClass("tooltip");
                expect(windowEl).toHaveCssClass("bs-tooltip-right");
                expect(windowEl).toHaveCssClass("bs-tooltip-right-top");
                expect(windowEl.textContent.trim()).toBe("Great tip!");
            });

            it("should accept placement in array(second value of the array should be applied)", () => {
                const fixture =
                    createTestComponent(
                        `<div ngbTooltip="Great tip!" [placement]="['left-top','top-right']"></div>`);
                const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

                directive.triggerEventHandler("mouseenter", {});
                fixture.detectChanges();
                const windowEl = getWindow(fixture.nativeElement);

                expect(windowEl).toHaveCssClass("tooltip");
                expect(windowEl).toHaveCssClass("bs-tooltip-top");
                expect(windowEl).toHaveCssClass("bs-tooltip-top-right");
                expect(windowEl.textContent.trim()).toBe("Great tip!");
            });

            it("should apply auto placement", () => {
                const fixture = createTestComponent(`<div ngbTooltip="Great tip!" placement="auto"></div>`);
                const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

                directive.triggerEventHandler("mouseenter", {});
                fixture.detectChanges();
                const windowEl = getWindow(fixture.nativeElement);

                expect(windowEl).toHaveCssClass("tooltip");
                // actual placement with auto is not known in advance, so use regex to check it
                expect(windowEl.getAttribute("class")).toMatch("bs-tooltip-\.");
                expect(windowEl.textContent.trim()).toBe("Great tip!");
            });

        });

        describe("triggers", () => {

            it("should support toggle triggers", () => {
                const fixture = createTestComponent(`<div ngbTooltip="Great tip!" triggers="click"></div>`);
                const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

                directive.triggerEventHandler("click", {});
                fixture.detectChanges();
                expect(getWindow(fixture.nativeElement)).not.toBeNull();

                directive.triggerEventHandler("click", {});
                fixture.detectChanges();
                expect(getWindow(fixture.nativeElement)).toBeNull();
            });

            it("should non-default toggle triggers", () => {
                const fixture = createTestComponent(
                    `<div ngbTooltip="Great tip!" triggers="mouseenter:click"></div>`);
                const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

                directive.triggerEventHandler("mouseenter", {});
                fixture.detectChanges();
                expect(getWindow(fixture.nativeElement)).not.toBeNull();

                directive.triggerEventHandler("click", {});
                fixture.detectChanges();
                expect(getWindow(fixture.nativeElement)).toBeNull();
            });

            it("should support multiple triggers", () => {
                const fixture =
                    createTestComponent(
                        `<div ngbTooltip="Great tip!" triggers="mouseenter:mouseleave click"></div>`);
                const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

                directive.triggerEventHandler("mouseenter", {});
                fixture.detectChanges();
                expect(getWindow(fixture.nativeElement)).not.toBeNull();

                directive.triggerEventHandler("click", {});
                fixture.detectChanges();
                expect(getWindow(fixture.nativeElement)).toBeNull();
            });

            it("should not use default for manual triggers", () => {
                const fixture = createTestComponent(`<div ngbTooltip="Great tip!" triggers="manual"></div>`);
                const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

                directive.triggerEventHandler("mouseenter", {});
                fixture.detectChanges();
                expect(getWindow(fixture.nativeElement)).toBeNull();
            });

            it("should allow toggling for manual triggers", () => {
                const fixture = createTestComponent(`
                  <div ngbTooltip="Great tip!" triggers="manual" #t="ngbTooltip"></div>
                  <button (click)="t.toggle()">T</button>`);
                const button = fixture.nativeElement.querySelector("button");

                button.click();
                fixture.detectChanges();
                expect(getWindow(fixture.nativeElement)).not.toBeNull();

                button.click();
                fixture.detectChanges();
                expect(getWindow(fixture.nativeElement)).toBeNull();
            });

            it("should allow open / close for manual triggers", () => {
                const fixture = createTestComponent(`
                  <div ngbTooltip="Great tip!" triggers="manual" #t="ngbTooltip"></div>
                  <button (click)="t.open()">O</button>
                  <button (click)="t.close()">C</button>`);

                const buttons = fixture.nativeElement.querySelectorAll("button");

                buttons[0].click();  // open
                fixture.detectChanges();
                expect(getWindow(fixture.nativeElement)).not.toBeNull();

                buttons[1].click();  // close
                fixture.detectChanges();
                expect(getWindow(fixture.nativeElement)).toBeNull();
            });

            it("should not throw when open called for manual triggers and open tooltip", () => {
                const fixture = createTestComponent(`
                  <div ngbTooltip="Great tip!" triggers="manual" #t="ngbTooltip"></div>
                  <button (click)="t.open()">O</button>`);
                const button = fixture.nativeElement.querySelector("button");

                button.click();  // open
                fixture.detectChanges();
                expect(getWindow(fixture.nativeElement)).not.toBeNull();

                button.click();  // open
                fixture.detectChanges();
                expect(getWindow(fixture.nativeElement)).not.toBeNull();
            });

            it("should not throw when closed called for manual triggers and closed tooltip", () => {
                const fixture = createTestComponent(`
                  <div ngbTooltip="Great tip!" triggers="manual" #t="ngbTooltip"></div>
                  <button (click)="t.close()">C</button>`);

                const button = fixture.nativeElement.querySelector("button");

                button.click();  // close
                fixture.detectChanges();
                expect(getWindow(fixture.nativeElement)).toBeNull();
            });
        });
    });

    describe("container", () => {

        it("should be appended to the element matching the selector passed to \"container\"", () => {
            const selector = "body";
            const fixture =
                createTestComponent(`<div ngbTooltip="Great tip!" container="` + selector + `"></div>`);
            const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

            directive.triggerEventHandler("mouseenter", {});
            fixture.detectChanges();
            expect(getWindow(fixture.nativeElement)).toBeNull();
            expect(getWindow(document.querySelector(selector))).not.toBeNull();
        });

        it("should properly destroy tooltips when the \"container\" option is used", () => {
            const selector = "body";
            const fixture =
                createTestComponent(
                    `<div *ngIf="show" ngbTooltip="Great tip!" container="` + selector + `"></div>`);
            const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

            directive.triggerEventHandler("mouseenter", {});
            fixture.detectChanges();

            expect(getWindow(document.querySelector(selector))).not.toBeNull();
            fixture.componentRef.instance.show = false;
            fixture.detectChanges();
            expect(getWindow(document.querySelector(selector))).toBeNull();
        });
    });

    describe("visibility", () => {
        it("should emit events when showing and hiding tooltip", () => {
            const fixture = createTestComponent(
                `<div ngbTooltip="Great tip!" triggers="click" (shown)="shown()" (hidden)="hidden()"></div>`);
            const directive = fixture.debugElement.query(By.directive(NgbTooltipDirective));

            const shownSpy = spyOn(fixture.componentInstance, "shown");
            const hiddenSpy = spyOn(fixture.componentInstance, "hidden");

            directive.triggerEventHandler("click", {});
            fixture.detectChanges();
            expect(getWindow(fixture.nativeElement)).not.toBeNull();
            expect(shownSpy).toHaveBeenCalled();

            directive.triggerEventHandler("click", {});
            fixture.detectChanges();
            expect(getWindow(fixture.nativeElement)).toBeNull();
            expect(hiddenSpy).toHaveBeenCalled();
        });

        it("should not emit close event when already closed", () => {
            const fixture = createTestComponent(
                `<div ngbTooltip="Great tip!" triggers="manual" (shown)="shown()" (hidden)="hidden()"></div>`);

            const shownSpy = spyOn(fixture.componentInstance, "shown");
            const hiddenSpy = spyOn(fixture.componentInstance, "hidden");

            fixture.componentInstance.tooltip.open();
            fixture.detectChanges();

            fixture.componentInstance.tooltip.open();
            fixture.detectChanges();

            expect(getWindow(fixture.nativeElement)).not.toBeNull();
            expect(shownSpy).toHaveBeenCalled();
            expect(shownSpy.calls.count()).toEqual(1);
            expect(hiddenSpy).not.toHaveBeenCalled();
        });

        it("should not emit open event when already opened", () => {
            const fixture = createTestComponent(
                `<div ngbTooltip="Great tip!" triggers="manual" (shown)="shown()" (hidden)="hidden()"></div>`);

            const shownSpy = spyOn(fixture.componentInstance, "shown");
            const hiddenSpy = spyOn(fixture.componentInstance, "hidden");

            fixture.componentInstance.tooltip.close();
            fixture.detectChanges();
            expect(getWindow(fixture.nativeElement)).toBeNull();
            expect(shownSpy).not.toHaveBeenCalled();
            expect(hiddenSpy).not.toHaveBeenCalled();
        });

        it("should report correct visibility", () => {
            const fixture = createTestComponent(`<div ngbTooltip="Great tip!" triggers="manual"></div>`);
            fixture.detectChanges();

            expect(fixture.componentInstance.tooltip.isOpen()).toBeFalsy();

            fixture.componentInstance.tooltip.open();
            fixture.detectChanges();
            expect(fixture.componentInstance.tooltip.isOpen()).toBeTruthy();

            fixture.componentInstance.tooltip.close();
            fixture.detectChanges();
            expect(fixture.componentInstance.tooltip.isOpen()).toBeFalsy();
        });
    });

    describe("Custom config", () => {
        let config: NgbTooltipConfig;

        beforeEach(() => {
            TestBed.configureTestingModule({ imports: [UserInterfaceLibModule] });
            TestBed.overrideComponent(TestComponent, {
                set: { template: `<div ngbTooltip="Great tip!"></div>` }
            });
        });

        beforeEach(() => {
            config = TestBed.get(NgbTooltipConfig);
            config.placement = "bottom";
            config.triggers = "click";
            config.container = "body";
            config.tooltipClass = "my-custom-class";
        });

        it("should initialize inputs with provided config", () => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            const tooltip = fixture.componentInstance.tooltip;

            expect(tooltip.placement).toBe(config.placement);
            expect(tooltip.triggers).toBe(config.triggers);
            expect(tooltip.container).toBe(config.container);
            expect(tooltip.tooltipClass).toBe(config.tooltipClass);
        });
    });

    describe("Custom config as provider", () => {
        const config = new NgbTooltipConfig();
        config.placement = "bottom";
        config.triggers = "click";
        config.container = "body";
        config.tooltipClass = "my-custom-class";

        beforeEach(() => {
            TestBed.configureTestingModule(
                {
                    imports: [UserInterfaceLibModule],
                    providers: [{
                        provide: NgbTooltipConfig,
                        useValue: config
                    }]
                });
        });

        it("should initialize inputs with provided config as provider", () => {
            const fixture = createTestComponent(`<div ngbTooltip="Great tip!"></div>`);
            const tooltip = fixture.componentInstance.tooltip;

            expect(tooltip.placement).toBe(config.placement);
            expect(tooltip.triggers).toBe(config.triggers);
            expect(tooltip.container).toBe(config.container);
            expect(tooltip.tooltipClass).toBe(config.tooltipClass);
        });
    });

    describe("non-regression", () => {

        /**
         * Under very specific conditions ngOnDestroy can be invoked without calling ngOnInit first.
         * See discussion in https://github.com/ng-bootstrap/ng-bootstrap/issues/2199 for more details.
         */
        it("should not try to call listener cleanup function when no listeners registered", () => {
            const fixture = createTestComponent(`
          <ng-template #tpl><div ngbTooltip="Great tip!"></div></ng-template>
          <button (click)="createAndDestroyTplWithATooltip(tpl)"></button>
        `);
            const buttonEl = fixture.debugElement.query(By.css("button"));
            buttonEl.triggerEventHandler("click", {});
        });
    });
});

@Component({ selector: "test-cmpt", template: `` })

export class TestComponent {
    public name = "World";
    public show = true;

    @ViewChild(NgbTooltipDirective) public tooltip: NgbTooltipDirective;

    constructor(private vcRef: ViewContainerRef) { }

    // tslint:disable-next-line: no-empty
    public shown() { }
    // tslint:disable-next-line: no-empty
    public hidden() { }

    public createAndDestroyTplWithATooltip(tpl: TemplateRef<any>) {
        this.vcRef.createEmbeddedView(tpl, {}, 0);
        this.vcRef.remove(0);
    }
}

// tslint:disable-next-line: max-classes-per-file
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "test-onpush-cmpt",
    template: ``
})

export class TestOnPushComponent {
}
