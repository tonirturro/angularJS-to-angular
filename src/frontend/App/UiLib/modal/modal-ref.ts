import {ComponentRef} from "@angular/core";

import { ContentRef } from "../util/content-ref";
import { NgbModalBackdropComponent } from "./modal-backdrop.component";
import { NgbModalWindowComponent } from "./modal-window.component";

/**
 * A reference to a newly opened modal returned by the 'NgbModal.open()' method.
 */
export class NgbModalRef {

  /**
   * The instance of component used as modal's content.
   * Undefined when a TemplateRef is used as modal's content.
   */
  get componentInstance(): any {
    if (this.contentRef.componentRef) {
      return this.contentRef.componentRef.instance;
    }
  }

  /**
   * A promise that is resolved when the modal is closed and rejected when the modal is dismissed.
   */
  public result: Promise<any>;
  private resolve: (result?: any) => void;
  private reject: (reason?: any) => void;

  constructor(
      private windowCmptRef: ComponentRef<NgbModalWindowComponent>,
      private contentRef: ContentRef,
      private backdropCmptRef?: ComponentRef<NgbModalBackdropComponent>,
// tslint:disable-next-line: ban-types
      private beforeDismiss?: Function) {
    windowCmptRef.instance.dismissEvent.subscribe((reason: any) => { this.dismiss(reason); });

    this.result = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
// tslint:disable-next-line: no-empty
    this.result.then(null, () => {});
  }

  /**
   * Closes the modal with an optional 'result' value.
   * The 'NgbMobalRef.result' promise will be resolved with provided value.
   */
  public close(result?: any): void {
    if (this.windowCmptRef) {
      this.resolve(result);
      this._removeModalElements();
    }
  }

  /**
   * Dismisses the modal with an optional 'reason' value.
   * The 'NgbModalRef.result' promise will be rejected with provided value.
   */
  public dismiss(reason?: any): void {
    if (this.windowCmptRef) {
      if (!this.beforeDismiss) {
        this._dismiss(reason);
      } else {
        const dismiss = this.beforeDismiss();
        if (dismiss && dismiss.then) {
          dismiss.then(
              (result) => {
                if (result !== false) {
                  this._dismiss(reason);
                }
              },
// tslint:disable-next-line: no-empty
              () => {});
        } else if (dismiss !== false) {
          this._dismiss(reason);
        }
      }
    }
  }

  private _dismiss(reason?: any) {
    this.reject(reason);
    this._removeModalElements();
  }

  private _removeModalElements() {
    const windowNativeEl = this.windowCmptRef.location.nativeElement;
    windowNativeEl.parentNode.removeChild(windowNativeEl);
    this.windowCmptRef.destroy();

    if (this.backdropCmptRef) {
      const backdropNativeEl = this.backdropCmptRef.location.nativeElement;
      backdropNativeEl.parentNode.removeChild(backdropNativeEl);
      this.backdropCmptRef.destroy();
    }

    if (this.contentRef && this.contentRef.viewRef) {
      this.contentRef.viewRef.destroy();
    }

    this.windowCmptRef = null;
    this.backdropCmptRef = null;
    this.contentRef = null;
  }
}
