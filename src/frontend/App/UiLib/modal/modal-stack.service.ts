import {DOCUMENT} from "@angular/common";
import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  RendererFactory2,
  TemplateRef,
} from "@angular/core";
import {Subject} from "rxjs";

import {ngbFocusTrap} from "../util/focus-trap";

import { ContentRef } from "../util/content-ref";

import { isDefined, isString } from "../util/util";
import { NgbActiveModal } from "./modal-active";

import { ScrollBarService } from "../util/scrollbar.service";
import { NgbModalBackdropComponent } from "./modal-backdrop.component";
import { NgbModalRef } from "./modal-ref";
import { NgbModalWindowComponent } from "./modal-window.component";

@Injectable({providedIn: "root"})
export class NgbModalStackService {
  private activeWindowCmptHasChanged = new Subject();
  private ariaHiddenValues: Map<Element, string> = new Map();
  private backdropAttributes = ["backdropClass"];
  private modalRefs: NgbModalRef[] = [];
  private windowAttributes = ["ariaLabelledBy", "backdrop", "centered", "keyboard", "size", "windowClass"];
  private windowCmpts: Array<ComponentRef<NgbModalWindowComponent>> = [];

  constructor(
      private applicationRef: ApplicationRef,
      private injector: Injector,
      @Inject(DOCUMENT) private document: any,
      private scrollBar: ScrollBarService, private rendererFactory: RendererFactory2) {
    // Trap focus on active WindowCmpt
    this.activeWindowCmptHasChanged.subscribe(() => {
      if (this.windowCmpts.length) {
        const activeWindowCmpt = this.windowCmpts[this.windowCmpts.length - 1];
        ngbFocusTrap(activeWindowCmpt.location.nativeElement, this.activeWindowCmptHasChanged);
        this._revertAriaHidden();
        this._setAriaHidden(activeWindowCmpt.location.nativeElement);
      }
    });
  }

  public open(moduleCFR: ComponentFactoryResolver, contentInjector: Injector, content: any, options): NgbModalRef {
    const containerEl =
        isDefined(options.container) ? this.document.querySelector(options.container) : this.document.body;
    const renderer = this.rendererFactory.createRenderer(null, null);

    const revertPaddingForScrollBar = this.scrollBar.compensate();
    const removeBodyClass = () => {
      if (!this.modalRefs.length) {
        renderer.removeClass(this.document.body, "modal-open");
        this._revertAriaHidden();
      }
    };

    if (!containerEl) {
      throw new Error(`The specified modal container "${options.container || "body"}" was not found in the DOM.`);
    }

    const activeModal = new NgbActiveModal();
    const contentRef = this._getContentRef(moduleCFR, options.injector || contentInjector, content, activeModal);

    const backdropCmptRef: ComponentRef<NgbModalBackdropComponent> =
        options.backdrop !== false ? this._attachBackdrop(moduleCFR, containerEl) : null;
    const windowCmptRef: ComponentRef<NgbModalWindowComponent> =
        this._attachWindowComponent(moduleCFR, containerEl, contentRef);
    const ngbModalRef: NgbModalRef = new NgbModalRef(windowCmptRef, contentRef, backdropCmptRef, options.beforeDismiss);

    this._registerModalRef(ngbModalRef);
    this._registerWindowCmpt(windowCmptRef);
    ngbModalRef.result.then(revertPaddingForScrollBar, revertPaddingForScrollBar);
    ngbModalRef.result.then(removeBodyClass, removeBodyClass);
    activeModal.close = (result: any) => { ngbModalRef.close(result); };
    activeModal.dismiss = (reason: any) => { ngbModalRef.dismiss(reason); };

    this._applyWindowOptions(windowCmptRef.instance, options);
    if (this.modalRefs.length === 1) {
      renderer.addClass(this.document.body, "modal-open");
    }

    if (backdropCmptRef && backdropCmptRef.instance) {
      this._applyBackdropOptions(backdropCmptRef.instance, options);
    }
    return ngbModalRef;
  }

  public dismissAll(reason?: any) { this.modalRefs.forEach((ngbModalRef) => ngbModalRef.dismiss(reason)); }

  public hasOpenModals(): boolean { return this.modalRefs.length > 0; }

  private _attachBackdrop(
      moduleCFR: ComponentFactoryResolver,
      containerEl: any): ComponentRef<NgbModalBackdropComponent> {
    const backdropFactory = moduleCFR.resolveComponentFactory(NgbModalBackdropComponent);
    const backdropCmptRef = backdropFactory.create(this.injector);
    this.applicationRef.attachView(backdropCmptRef.hostView);
    containerEl.appendChild(backdropCmptRef.location.nativeElement);
    return backdropCmptRef;
  }

  private _attachWindowComponent(moduleCFR: ComponentFactoryResolver, containerEl: any, contentRef: any):
      ComponentRef<NgbModalWindowComponent> {
    const windowFactory = moduleCFR.resolveComponentFactory(NgbModalWindowComponent);
    const windowCmptRef = windowFactory.create(this.injector, contentRef.nodes);
    this.applicationRef.attachView(windowCmptRef.hostView);
    containerEl.appendChild(windowCmptRef.location.nativeElement);
    return windowCmptRef;
  }

  private _applyWindowOptions(windowInstance: NgbModalWindowComponent, options: any): void {
    this.windowAttributes.forEach((optionName: string) => {
      if (isDefined(options[optionName])) {
        windowInstance[optionName] = options[optionName];
      }
    });
  }

  private _applyBackdropOptions(backdropInstance: NgbModalBackdropComponent, options: any): void {
    this.backdropAttributes.forEach((optionName: string) => {
      if (isDefined(options[optionName])) {
        backdropInstance[optionName] = options[optionName];
      }
    });
  }

  private _getContentRef(
      moduleCFR: ComponentFactoryResolver, contentInjector: Injector, content: any,
      activeModal: NgbActiveModal): ContentRef {
    if (!content) {
      return new ContentRef([]);
    } else if (content instanceof TemplateRef) {
      return this._createFromTemplateRef(content, activeModal);
    } else if (isString(content)) {
      return this._createFromString(content);
    } else {
      return this._createFromComponent(moduleCFR, contentInjector, content, activeModal);
    }
  }

  private _createFromTemplateRef(content: TemplateRef<any>, activeModal: NgbActiveModal): ContentRef {
    const context = {
      $implicit: activeModal,
      close(result) { activeModal.close(result); },
      dismiss(reason) { activeModal.dismiss(reason); }
    };
    const viewRef = content.createEmbeddedView(context);
    this.applicationRef.attachView(viewRef);
    return new ContentRef([viewRef.rootNodes], viewRef);
  }

  private _createFromString(content: string): ContentRef {
    const component = this.document.createTextNode(`${content}`);
    return new ContentRef([[component]]);
  }

  private _createFromComponent(
      moduleCFR: ComponentFactoryResolver, contentInjector: Injector, content: any,
      context: NgbActiveModal): ContentRef {
    const contentCmptFactory = moduleCFR.resolveComponentFactory(content);
    const modalContentInjector =
        Injector.create({providers: [{provide: NgbActiveModal, useValue: context}], parent: contentInjector});
    const componentRef = contentCmptFactory.create(modalContentInjector);
    this.applicationRef.attachView(componentRef.hostView);
    return new ContentRef([[componentRef.location.nativeElement]], componentRef.hostView, componentRef);
  }

  private _setAriaHidden(element: Element) {
    const parent = element.parentElement;
    if (parent && element !== this.document.body) {
      Array.from(parent.children).forEach((sibling) => {
        if (sibling !== element && sibling.nodeName !== "SCRIPT") {
          this.ariaHiddenValues.set(sibling, sibling.getAttribute("aria-hidden"));
          sibling.setAttribute("aria-hidden", "true");
        }
      });

      this._setAriaHidden(parent);
    }
  }

  private _revertAriaHidden() {
    this.ariaHiddenValues.forEach((value, element) => {
      if (value) {
        element.setAttribute("aria-hidden", value);
      } else {
        element.removeAttribute("aria-hidden");
      }
    });
    this.ariaHiddenValues.clear();
  }

  private _registerModalRef(ngbModalRef: NgbModalRef) {
    const unregisterModalRef = () => {
      const index = this.modalRefs.indexOf(ngbModalRef);
      if (index > -1) {
        this.modalRefs.splice(index, 1);
      }
    };
    this.modalRefs.push(ngbModalRef);
    ngbModalRef.result.then(unregisterModalRef, unregisterModalRef);
  }

  private _registerWindowCmpt(ngbWindowCmpt: ComponentRef<NgbModalWindowComponent>) {
    this.windowCmpts.push(ngbWindowCmpt);
    this.activeWindowCmptHasChanged.next();

    ngbWindowCmpt.onDestroy(() => {
      const index = this.windowCmpts.indexOf(ngbWindowCmpt);
      if (index > -1) {
        this.windowCmpts.splice(index, 1);
        this.activeWindowCmptHasChanged.next();
      }
    });
  }
}
