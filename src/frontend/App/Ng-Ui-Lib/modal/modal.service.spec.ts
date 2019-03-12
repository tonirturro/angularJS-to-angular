import {
  DebugElement,
  getDebugNode,
  Injector} from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CustomMatchers } from "../../../../../test/CustomMatchers";
import { NgbModalConfig } from "./modal-config";
import { CustomInjectorComponent } from "./test/custom-injector.component";
import { CustomSpyService } from "./test/custom-spy.service";
import { DestroyableComponent } from "./test/destroyable.component";
import { NgbModalTestModule } from "./test/ngb-modal-test.module";
import { SpyService } from "./test/spy.service";
import { TestA11yComponent } from "./test/test-a11y.component.ng2";
import { TestComponent } from "./test/test.component.ng2";
import { WithActiveModalComponent } from "./test/with-active-modal.component.ng2";
import { WithAutofocusModalComponent } from "./test/with-autofocus-modal.component";
import { WithFirstFocusableModalComponent } from "./test/with-first-focusable-modal.component.ng2";
import {
  WithSkipTabindexFirstFocusableModalComponent
} from "./test/with-skip-tableindex-first-focusable-modal.component.ng2";

// tslint:disable-next-line: no-empty
const NOOP = () => {};

describe("ngb-modal", () => {

  let fixture: ComponentFixture<TestComponent>;

  beforeAll(() => {
    jasmine.addMatchers(CustomMatchers);
  });

  afterEach(() => {
    // detect left-over modals and report errors when found

    const remainingModalWindows = document.querySelectorAll("ngb-modal-window");
    if (remainingModalWindows.length) {
      fail(`${remainingModalWindows.length} modal windows were left in the DOM.`);
    }

    const remainingModalBackdrops = document.querySelectorAll("ngb-modal-backdrop");
    if (remainingModalBackdrops.length) {
      fail(`${remainingModalBackdrops.length} modal backdrops were left in the DOM.`);
    }
  });

  describe("default configuration", () => {

    beforeEach(() => {
      TestBed.configureTestingModule({imports: [NgbModalTestModule]});
      fixture = TestBed.createComponent(TestComponent);
    });

    describe("basic functionality", () => {

      it("should open and close modal with default options", () => {
        const modalInstance = fixture.componentInstance.open("foo");
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("foo");

        modalInstance.close("some result");
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should open and close modal from a TemplateRef content", () => {
        const modalInstance = fixture.componentInstance.openTpl();
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("Hello, World!");

        modalInstance.close("some result");
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should properly destroy TemplateRef content", () => {
        const spyService = fixture.debugElement.injector.get(SpyService);
        const modalInstance = fixture.componentInstance.openDestroyableTpl();
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("Some content");
        expect(spyService.called).toBeFalsy();

        modalInstance.close("some result");
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
        expect(spyService.called).toBeTruthy();
      });

      it("should open and close modal from a component type", () => {
        const spyService = fixture.debugElement.injector.get(SpyService);
        const modalInstance = fixture.componentInstance.openCmpt(DestroyableComponent);
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("Some content");
        expect(spyService.called).toBeFalsy();

        modalInstance.close("some result");
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
        expect(spyService.called).toBeTruthy();
      });

      it("should inject active modal ref when component is used as content", () => {
        fixture.componentInstance.openCmpt(WithActiveModalComponent);
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("Close");

        (document.querySelector("button.closeFromInside") as HTMLElement).click();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should expose component used as modal content", () => {
        const modalInstance = fixture.componentInstance.openCmpt(WithActiveModalComponent);
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("Close");
        expect(modalInstance.componentInstance instanceof WithActiveModalComponent).toBeTruthy();

        modalInstance.close();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should open and close modal from inside", () => {
        fixture.componentInstance.openTplClose();
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal();

        (document.querySelector("button#close") as HTMLElement).click();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should open and dismiss modal from inside", () => {
        fixture.componentInstance.openTplDismiss().result.catch(NOOP);
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal();

        (document.querySelector("button#dismiss") as HTMLElement).click();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should open and close modal from template implicit context", () => {
        fixture.componentInstance.openTplImplicitContext();
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal();

        (document.querySelector("button#close") as HTMLElement).click();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should open and dismiss modal from template implicit context", () => {
        fixture.componentInstance.openTplImplicitContext().result.catch(NOOP);
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal();

        (document.querySelector("button#dismiss") as HTMLElement).click();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should resolve result promise on close", () => {
        let resolvedResult;
        fixture.componentInstance.openTplClose().result.then((result) => resolvedResult = result);
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal();

        (document.querySelector("button#close") as HTMLElement).click();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();

        fixture.whenStable().then(() => { expect(resolvedResult).toBe("myResult"); });
      });

      it("should reject result promise on dismiss", () => {
        let rejectReason;
        fixture.componentInstance.openTplDismiss().result.catch((reason) => rejectReason = reason);
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal();

        (document.querySelector("button#dismiss") as HTMLElement).click();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();

        fixture.whenStable().then(() => { expect(rejectReason).toBe("myReason"); });
      });

      it("should add / remove \"modal-open\" class to body when modal is open", async(() => {
           const modalRef = fixture.componentInstance.open("bar");
           fixture.detectChanges();
           expect(fixture.nativeElement).toHaveModal();
           expect(document.body).toHaveCssClass("modal-open");

           modalRef.close("bar result");
           fixture.detectChanges();
           fixture.whenStable().then(() => {
             expect(fixture.nativeElement).not.toHaveModal();
             expect(document.body).not.toHaveCssClass("modal-open");
           });
         }));

      it("should not throw when close called multiple times", () => {
        const modalInstance = fixture.componentInstance.open("foo");
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("foo");

        modalInstance.close("some result");
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();

        modalInstance.close("some result");
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should dismiss with dismissAll", () => {
        fixture.componentInstance.open("foo");
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("foo");

        fixture.componentInstance.dismissAll("dismissAllArg");
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should not throw when dismissAll called with no active modal", () => {
        expect(fixture.nativeElement).not.toHaveModal();

        fixture.componentInstance.dismissAll();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should not throw when dismiss called multiple times", () => {
        const modalRef = fixture.componentInstance.open("foo");
        modalRef.result.catch(NOOP);

        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("foo");

        modalRef.dismiss("some reason");
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();

        modalRef.dismiss("some reason");
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should indicate if there are open modal windows", async(() => {
           fixture.componentInstance.open("foo");
           fixture.detectChanges();
           expect(fixture.nativeElement).toHaveModal("foo");
           expect(fixture.componentInstance.modalService.hasOpenModals()).toBeTruthy();

           fixture.componentInstance.dismissAll();
           fixture.detectChanges();
           expect(fixture.nativeElement).not.toHaveModal();
           fixture.whenStable().then(
               () => { expect(fixture.componentInstance.modalService.hasOpenModals()).toBeFalsy(); });
         }));
    });

    describe("stacked  modals", () => {

      it("should not remove \"modal-open\" class on body when closed modal is not last", async(() => {
           const modalRef1 = fixture.componentInstance.open("foo");
           const modalRef2 = fixture.componentInstance.open("bar");
           fixture.detectChanges();
           expect(fixture.nativeElement).toHaveModal();
           expect(document.body).toHaveCssClass("modal-open");

           modalRef1.close("foo result");
           fixture.detectChanges();
           fixture.whenStable().then(() => {
             expect(fixture.nativeElement).toHaveModal();
             expect(document.body).toHaveCssClass("modal-open");

             modalRef2.close("bar result");
             fixture.detectChanges();
             fixture.whenStable().then(() => {
               expect(fixture.nativeElement).not.toHaveModal();
               expect(document.body).not.toHaveCssClass("modal-open");
             });
           });
         }));

      it("should dismiss modals on ESC in correct order", () => {
        fixture.componentInstance.open("foo").result.catch(NOOP);
        fixture.componentInstance.open("bar").result.catch(NOOP);
        const ngbModalWindow1 = document.querySelectorAll("ngb-modal-window")[0];
        const ngbModalWindow2 = document.querySelectorAll("ngb-modal-window")[1];
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal(["foo", "bar"]);
        expect(document.activeElement).toBe(ngbModalWindow2);

        (getDebugNode(document.activeElement) as DebugElement).triggerEventHandler("keyup.esc", {});
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal(["foo"]);
        expect(document.activeElement).toBe(ngbModalWindow1);

        (getDebugNode(document.activeElement) as DebugElement).triggerEventHandler("keyup.esc", {});
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
        expect(document.activeElement).toBe(document.body);
      });
    });

    describe("backdrop options", () => {

      it("should have backdrop by default", () => {
        const modalInstance = fixture.componentInstance.open("foo");
        fixture.detectChanges();

        expect(fixture.nativeElement).toHaveModal("foo");
        expect(fixture.nativeElement).toHaveBackdrop();

        modalInstance.close("some reason");
        fixture.detectChanges();

        expect(fixture.nativeElement).not.toHaveModal();
        expect(fixture.nativeElement).not.toHaveBackdrop();
      });

      it("should open and close modal without backdrop", () => {
        const modalInstance = fixture.componentInstance.open("foo", {backdrop: false});
        fixture.detectChanges();

        expect(fixture.nativeElement).toHaveModal("foo");
        expect(fixture.nativeElement).not.toHaveBackdrop();

        modalInstance.close("some reason");
        fixture.detectChanges();

        expect(fixture.nativeElement).not.toHaveModal();
        expect(fixture.nativeElement).not.toHaveBackdrop();
      });

      it("should open and close modal without backdrop from template content", () => {
        const modalInstance = fixture.componentInstance.openTpl({backdrop: false});
        fixture.detectChanges();

        expect(fixture.nativeElement).toHaveModal("Hello, World!");
        expect(fixture.nativeElement).not.toHaveBackdrop();

        modalInstance.close("some reason");
        fixture.detectChanges();

        expect(fixture.nativeElement).not.toHaveModal();
        expect(fixture.nativeElement).not.toHaveBackdrop();
      });

      it("should dismiss on backdrop click", () => {
        fixture.componentInstance.open("foo").result.catch(NOOP);
        fixture.detectChanges();

        expect(fixture.nativeElement).toHaveModal("foo");
        expect(fixture.nativeElement).toHaveBackdrop();

        (document.querySelector("ngb-modal-window") as HTMLElement).click();
        fixture.detectChanges();

        expect(fixture.nativeElement).not.toHaveModal();
        expect(fixture.nativeElement).not.toHaveBackdrop();
      });

      it("should not dismiss on \"static\" backdrop click", () => {
        const modalInstance = fixture.componentInstance.open("foo", {backdrop: "static"});
        fixture.detectChanges();

        expect(fixture.nativeElement).toHaveModal("foo");
        expect(fixture.nativeElement).toHaveBackdrop();

        (document.querySelector("ngb-modal-window") as HTMLElement).click();
        fixture.detectChanges();

        expect(fixture.nativeElement).toHaveModal();
        expect(fixture.nativeElement).toHaveBackdrop();

        modalInstance.close();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should not dismiss on clicks outside content where there is no backdrop", () => {
        const modalInstance = fixture.componentInstance.open("foo", {backdrop: false});
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("foo");

        (document.querySelector("ngb-modal-window") as HTMLElement).click();
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal();

        modalInstance.close();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should not dismiss on clicks that result in detached elements", () => {
        const modalInstance = fixture.componentInstance.openTplIf({});
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal();

        (document.querySelector("button#if") as HTMLElement).click();
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal();

        modalInstance.close();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });
    });

    describe("beforeDismiss options", () => {

      it("should not dismiss when the callback returns false", () => {
        const modalInstance = fixture.componentInstance.openTplDismiss({beforeDismiss: () => false});
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal();

        (document.querySelector("button#dismiss") as HTMLElement).click();
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal();

        modalInstance.close();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should dismiss when the callback does not return false", () => {
        fixture.componentInstance.openTplDismiss({beforeDismiss: NOOP});
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal();

        (document.querySelector("button#dismiss") as HTMLElement).click();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should not dismiss when the returned promise is resolved with false", async(() => {
           const modalInstance =
               fixture.componentInstance.openTplDismiss({beforeDismiss: () => Promise.resolve(false)});
           fixture.detectChanges();
           expect(fixture.nativeElement).toHaveModal();

           (document.querySelector("button#dismiss") as HTMLElement).click();
           fixture.detectChanges();
           fixture.whenStable().then(() => {
             expect(fixture.nativeElement).toHaveModal();

             modalInstance.close();
             fixture.detectChanges();
             expect(fixture.nativeElement).not.toHaveModal();
           });
         }));

      it("should not dismiss when the returned promise is rejected", async(() => {
           const modalInstance =
               fixture.componentInstance.openTplDismiss({beforeDismiss: () => Promise.reject("error")});
           fixture.detectChanges();
           expect(fixture.nativeElement).toHaveModal();

           (document.querySelector("button#dismiss") as HTMLElement).click();
           fixture.detectChanges();
           fixture.whenStable().then(() => {
             expect(fixture.nativeElement).toHaveModal();

             modalInstance.close();
             fixture.detectChanges();
             expect(fixture.nativeElement).not.toHaveModal();
           });
         }));

      it("should dismiss when the returned promise is not resolved with false", async(() => {
           fixture.componentInstance.openTplDismiss({beforeDismiss: () => Promise.resolve()});
           fixture.detectChanges();
           expect(fixture.nativeElement).toHaveModal();

           (document.querySelector("button#dismiss") as HTMLElement).click();
           fixture.detectChanges();
           fixture.whenStable().then(() => { expect(fixture.nativeElement).not.toHaveModal(); });
         }));

      it("should dismiss when the callback is not defined", () => {
        fixture.componentInstance.openTplDismiss({});
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal();

        (document.querySelector("button#dismiss") as HTMLElement).click();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });
    });

    describe("container options", () => {

      it("should attach window and backdrop elements to the specified container", () => {
        const modalInstance = fixture.componentInstance.open("foo", {container: "#testContainer"});
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("foo", "#testContainer");

        modalInstance.close();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should throw when the specified container element doesn't exist", () => {
        const brokenSelector = "#notInTheDOM";
        expect(() => {
          fixture.componentInstance.open("foo", {container: brokenSelector});
        }).toThrowError(`The specified modal container "${brokenSelector}" was not found in the DOM.`);
      });
    });

    describe("keyboard options", () => {

      it("should dismiss modals on ESC by default", () => {
        fixture.componentInstance.open("foo").result.catch(NOOP);
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("foo");

        (getDebugNode(document.querySelector("ngb-modal-window")) as DebugElement).triggerEventHandler("keyup.esc", {});
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should not dismiss modals on ESC when keyboard option is false", () => {
        const modalInstance = fixture.componentInstance.open("foo", {keyboard: false});
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("foo");

        (getDebugNode(document.querySelector("ngb-modal-window")) as DebugElement).triggerEventHandler("keyup.esc", {});
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal();

        modalInstance.close();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should not dismiss modals on ESC when default is prevented", () => {
        const modalInstance = fixture.componentInstance.open("foo", {keyboard: true});
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("foo");

        (getDebugNode(document.querySelector("ngb-modal-window")) as DebugElement).triggerEventHandler("keyup.esc", {
          defaultPrevented: true
        });
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal();

        modalInstance.close();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });
    });

    describe("size options", () => {

      it("should render modals with specified size", () => {
        const modalInstance = fixture.componentInstance.open("foo", {size: "sm"});
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("foo");
        expect(document.querySelector(".modal-dialog")).toHaveCssClass("modal-sm");

        modalInstance.close();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

    });

    describe("window custom class options", () => {

      it("should render modals with the correct window custom classes", () => {
        const modalInstance = fixture.componentInstance.open("foo", {windowClass: "bar"});
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("foo");
        expect(document.querySelector("ngb-modal-window")).toHaveCssClass("bar");

        modalInstance.close();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

    });

    describe("backdrop custom class options", () => {

      it("should render modals with the correct backdrop custom classes", () => {
        const modalInstance = fixture.componentInstance.open("foo", {backdropClass: "my-fancy-backdrop"});
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("foo");
        expect(document.querySelector("ngb-modal-backdrop")).toHaveCssClass("my-fancy-backdrop");

        modalInstance.close();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

    });

    describe("custom injector option", () => {

      it("should render modal with a custom injector", () => {
        const customInjector =
            Injector.create({providers: [{provide: CustomSpyService, useClass: CustomSpyService, deps: []}]});
        const modalInstance = fixture.componentInstance.openCmpt(CustomInjectorComponent, {injector: customInjector});
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("Some content");

        modalInstance.close();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

    });

    describe("focus management", () => {

      it("should return focus to previously focused element", () => {
        fixture.detectChanges();
        const openButtonEl = fixture.nativeElement.querySelector("button#open");
        openButtonEl.focus();
        openButtonEl.click();
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("from button");

        fixture.componentInstance.close();
        expect(fixture.nativeElement).not.toHaveModal();
        expect(document.activeElement).toBe(openButtonEl);
      });

      it("should return focus to body if no element focused prior to modal opening", () => {
        const modalInstance = fixture.componentInstance.open("foo");
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("foo");
        expect(document.activeElement).toBe(document.querySelector("ngb-modal-window"));

        modalInstance.close("ok!");
        expect(document.activeElement).toBe(document.body);
      });

      it("should return focus to body if the opening element is not stored as previously focused element", () => {
        fixture.detectChanges();
        const openElement = fixture.nativeElement.querySelector("#open-no-focus");

        openElement.click();
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("from non focusable element");
        expect(document.activeElement).toBe(document.querySelector("ngb-modal-window"));

        fixture.componentInstance.close();
        expect(fixture.nativeElement).not.toHaveModal();
        expect(document.activeElement).toBe(document.body);
      });

      it("should return focus to body if the opening element is stored but cannot be focused", () => {
        fixture.detectChanges();
        const openElement = fixture.nativeElement.querySelector("#open-no-focus-ie");

        openElement.click();
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("from non focusable element but stored as activeElement on IE");
        expect(document.activeElement).toBe(document.querySelector("ngb-modal-window"));

        fixture.componentInstance.close();
        expect(fixture.nativeElement).not.toHaveModal();
        expect(document.activeElement).toBe(document.body);
      });

      describe("initial focus", () => {
        it("should focus the proper specified element when [ngbAutofocus] is used", () => {
          fixture.detectChanges();
          const modal = fixture.componentInstance.openCmpt(WithAutofocusModalComponent);
          fixture.detectChanges();

          expect(document.activeElement).toBe(document.querySelector("button.withNgbAutofocus"));
          modal.close();
        });

        it("should focus the first focusable element when [ngbAutofocus] is not used", () => {
          fixture.detectChanges();
          const modal = fixture.componentInstance.openCmpt(WithFirstFocusableModalComponent);
          fixture.detectChanges();

          expect(document.activeElement).toBe(document.querySelector("button.firstFocusable"));
          modal.close();
          fixture.detectChanges();
        });

        it("should skip element with tabindex=-1 when finding the first focusable element", () => {
          fixture.detectChanges();
          const modal = fixture.componentInstance.openCmpt(WithSkipTabindexFirstFocusableModalComponent);
          fixture.detectChanges();

          expect(document.activeElement).toBe(document.querySelector("button.other"));
          modal.close();
          fixture.detectChanges();
        });

        it("should focus modal window as a default fallback option", () => {
          fixture.detectChanges();
          const modal = fixture.componentInstance.open("content");
          fixture.detectChanges();

          expect(document.activeElement).toBe(document.querySelector("ngb-modal-window"));
          modal.close();
          fixture.detectChanges();
        });
      });
    });

    describe("window element ordering", () => {
      it("should place newer windows on top of older ones", () => {
        const modalInstance1 = fixture.componentInstance.open("foo", {windowClass: "window-1"});
        fixture.detectChanges();

        const modalInstance2 = fixture.componentInstance.open("bar", {windowClass: "window-2"});
        fixture.detectChanges();

        const windows = document.querySelectorAll("ngb-modal-window");
        expect(windows.length).toBe(2);
        expect(windows[0]).toHaveCssClass("window-1");
        expect(windows[1]).toHaveCssClass("window-2");

        modalInstance2.close();
        modalInstance1.close();
        fixture.detectChanges();
      });
    });

    describe("vertically centered", () => {

      it("should render modals vertically centered", () => {
        const modalInstance = fixture.componentInstance.open("foo", {centered: true});
        fixture.detectChanges();
        expect(fixture.nativeElement).toHaveModal("foo");
        expect(document.querySelector(".modal-dialog")).toHaveCssClass("modal-dialog-centered");

        modalInstance.close();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });
    });

    describe("accessibility", () => {

      it("should support aria-labelledby", () => {
        const id = "aria-labelledby-id";

        const modalInstance = fixture.componentInstance.open("foo", {ariaLabelledBy: id});
        fixture.detectChanges();

        const modalElement = document.querySelector("ngb-modal-window") as HTMLElement;
        expect(modalElement.getAttribute("aria-labelledby")).toBe(id);

        modalInstance.close("some result");
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should have aria-modal attribute", () => {
        const a11yFixture = TestBed.createComponent(TestA11yComponent);
        const modalInstance = a11yFixture.componentInstance.open();
        a11yFixture.detectChanges();

        const modalElement = document.querySelector("ngb-modal-window") as HTMLElement;
        expect(modalElement.getAttribute("aria-modal")).toBe("true");

        modalInstance.close();
        fixture.detectChanges();
        expect(fixture.nativeElement).not.toHaveModal();
      });

      it("should add aria-hidden attributes to siblings when attached to body", async(async () => {
           const a11yFixture = TestBed.createComponent(TestA11yComponent);
           const modalInstance = a11yFixture.componentInstance.open();
           a11yFixture.detectChanges();

           const modal = document.querySelector("ngb-modal-window");
           const backdrop = document.querySelector("ngb-modal-backdrop");
           const application = document.querySelector("div[ng-version]");
           let ariaHidden = document.querySelectorAll("[aria-hidden]");

           expect(ariaHidden.length).toBeGreaterThan(2);  // 2 exist in the DOM initially
           expect(document.body.hasAttribute("aria-hidden")).toBe(false);
           expect(application.getAttribute("aria-hidden")).toBe("true");
           expect(backdrop.getAttribute("aria-hidden")).toBe("true");
           expect(modal.hasAttribute("aria-hidden")).toBe(false);

           modalInstance.close();
           fixture.detectChanges();
           await a11yFixture.whenStable();

           ariaHidden = document.querySelectorAll("[aria-hidden]");

           expect(ariaHidden.length).toBe(2);  // 2 exist in the DOM initially
           expect(a11yFixture.nativeElement).not.toHaveModal();
         }));

      it("should add aria-hidden attributes to siblings when attached to a container", async(async () => {
           const a11yFixture = TestBed.createComponent(TestA11yComponent);
           const modalInstance = a11yFixture.componentInstance.open({container: "#container"});
           a11yFixture.detectChanges();

           const modal = document.querySelector("ngb-modal-window");
           const backdrop = document.querySelector("ngb-modal-backdrop");
           const application = document.querySelector("div[ng-version]");
           const ariaRestoreTrue = document.querySelector(".to-restore-true");
           const ariaRestoreFalse = document.querySelector(".to-restore-false");

           expect(document.body.hasAttribute("aria-hidden")).toBe(false);
           expect(application.hasAttribute("aria-hidden")).toBe(false);
           expect(modal.hasAttribute("aria-hidden")).toBe(false);
           expect(backdrop.getAttribute("aria-hidden")).toBe("true");
           expect(ariaRestoreTrue.getAttribute("aria-hidden")).toBe("true");
           expect(ariaRestoreFalse.getAttribute("aria-hidden")).toBe("true");

           Array.from(document.querySelectorAll(".to-hide")).forEach((element) => {
             expect(element.getAttribute("aria-hidden")).toBe("true");
           });

           Array.from(document.querySelectorAll(".not-to-hide")).forEach((element) => {
             expect(element.hasAttribute("aria-hidden")).toBe(false);
           });

           modalInstance.close();
           fixture.detectChanges();
           await a11yFixture.whenStable();

           const ariaHidden = document.querySelectorAll("[aria-hidden]");

           expect(ariaHidden.length).toBe(2);  // 2 exist in the DOM initially
           expect(ariaRestoreTrue.getAttribute("aria-hidden")).toBe("true");
           expect(ariaRestoreFalse.getAttribute("aria-hidden")).toBe("false");
           expect(a11yFixture.nativeElement).not.toHaveModal();
         }));

      it("should add aria-hidden attributes with modal stacks", async(async () => {
           const a11yFixture = TestBed.createComponent(TestA11yComponent);
           const firstModalInstance = a11yFixture.componentInstance.open();
           const secondModalInstance = a11yFixture.componentInstance.open();
           a11yFixture.detectChanges();

           const modals = document.querySelectorAll("ngb-modal-window");
           const backdrops = document.querySelectorAll("ngb-modal-backdrop");
           let ariaHidden = document.querySelectorAll("[aria-hidden]");

           const hiddenElements = ariaHidden.length;
           expect(hiddenElements).toBeGreaterThan(2);  // 2 exist in the DOM initially

           expect(modals.length).toBe(2);
           expect(backdrops.length).toBe(2);

           expect(modals[0].hasAttribute("aria-hidden")).toBe(true);
           expect(backdrops[0].hasAttribute("aria-hidden")).toBe(true);

           expect(modals[1].hasAttribute("aria-hidden")).toBe(false);
           expect(backdrops[1].hasAttribute("aria-hidden")).toBe(true);

           secondModalInstance.close();
           fixture.detectChanges();
           await a11yFixture.whenStable();

           ariaHidden = document.querySelectorAll("[aria-hidden]");
           expect(document.querySelectorAll("ngb-modal-window").length).toBe(1);
           expect(document.querySelectorAll("ngb-modal-backdrop").length).toBe(1);

           expect(ariaHidden.length).toBe(hiddenElements - 2);

           expect(modals[0].hasAttribute("aria-hidden")).toBe(false);
           expect(backdrops[0].hasAttribute("aria-hidden")).toBe(true);

           firstModalInstance.close();
           fixture.detectChanges();
           await a11yFixture.whenStable();

           ariaHidden = document.querySelectorAll("[aria-hidden]");

           expect(ariaHidden.length).toBe(2);  // 2 exist in the DOM initially
           expect(a11yFixture.nativeElement).not.toHaveModal();
         }));
    });

  });

  describe("custom global configuration", () => {

    beforeEach(() => {
      TestBed.configureTestingModule(
          {imports: [NgbModalTestModule], providers: [{provide: NgbModalConfig, useValue: {size: "sm"}}]});
      fixture = TestBed.createComponent(TestComponent);
    });

    it("should accept global configuration under the NgbModalConfig token", () => {
      const modalInstance = fixture.componentInstance.open("foo");
      fixture.detectChanges();

      expect(fixture.nativeElement).toHaveModal("foo");
      expect(document.querySelector(".modal-dialog")).toHaveCssClass("modal-sm");

      modalInstance.close("some reason");
      fixture.detectChanges();
    });

    it("should override global configuration with local options", () => {
      const modalInstance = fixture.componentInstance.open("foo", {size: "lg"});
      fixture.detectChanges();

      expect(fixture.nativeElement).toHaveModal("foo");
      expect(document.querySelector(".modal-dialog")).toHaveCssClass("modal-lg");
      expect(document.querySelector(".modal-dialog")).not.toHaveCssClass("modal-sm");

      modalInstance.close("some reason");
      fixture.detectChanges();
    });
  });
});
