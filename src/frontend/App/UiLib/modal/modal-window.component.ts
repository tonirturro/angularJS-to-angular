import {DOCUMENT} from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";

import { getFocusableBoundaryElements } from "../util/focus-trap";
import { ModalDismissReasons } from "./modal-dismiss-reasons";

@Component({
  host: {
    "(click)": "backdropClick($event)",
    "(keyup.esc)": "escKey($event)",
    "[attr.aria-labelledby]": "ariaLabelledBy",
    "[attr.aria-modal]": "true",
    "[class]": "\"modal fade show d-block\" + (windowClass ? \" \" + windowClass : \"\")",
    "role": "dialog",
    "tabindex": "-1",
  },
  selector: "ngb-modal-window",
  template: `
    <div [class]="'modal-dialog' + (size ? ' modal-' + size : '') + (centered ? ' modal-dialog-centered' : '')"
         role="document">
        <div class="modal-content"><ng-content></ng-content></div>
    </div>
    `
})

export class NgbModalWindowComponent implements OnInit,
    AfterViewInit, OnDestroy {

  @Input() public ariaLabelledBy: string;
  @Input() public backdrop: boolean | string = true;
  @Input() public centered: string;
  @Input() public keyboard = true;
  @Input() public size: string;
  @Input() public windowClass: string;
  @Output("dismiss") public dismissEvent = new EventEmitter();
  private elWithFocus: Element;  // element that is focused prior to modal opening

  constructor(@Inject(DOCUMENT) private document: any, private elRef: ElementRef<HTMLElement>) {}

  public backdropClick($event): void {
    if (this.backdrop === true && this.elRef.nativeElement === $event.target) {
      this.dismiss(ModalDismissReasons.BACKDROP_CLICK);
    }
  }

  public escKey($event): void {
    if (this.keyboard && !$event.defaultPrevented) {
      this.dismiss(ModalDismissReasons.ESC);
    }
  }

  public dismiss(reason): void { this.dismissEvent.emit(reason); }

  public ngOnInit() { this.elWithFocus = this.document.activeElement; }

  public ngAfterViewInit() {
    if (!this.elRef.nativeElement.contains(document.activeElement)) {
      const autoFocusable = this.elRef.nativeElement.querySelector(`[ngbAutofocus]`) as HTMLElement;
      const firstFocusable = getFocusableBoundaryElements(this.elRef.nativeElement)[0];

      const elementToFocus = autoFocusable || firstFocusable || this.elRef.nativeElement;
      elementToFocus.focus();
    }
  }

  public ngOnDestroy() {
    const body = this.document.body;
    const elWithFocus = this.elWithFocus;

    let elementToFocus;
    // tslint:disable-next-line: no-string-literal
    if (elWithFocus && elWithFocus["focus"] && body.contains(elWithFocus)) {
      elementToFocus = elWithFocus;
    } else {
      elementToFocus = body;
    }
    elementToFocus.focus();
    this.elWithFocus = null;
  }
}
