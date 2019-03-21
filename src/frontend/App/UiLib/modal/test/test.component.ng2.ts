import { Component, ViewChild } from "@angular/core";

import { NgbModalRef, NgbModalService } from "../..";

@Component({
    selector: "test-cmpt",
    templateUrl: "./test.component.html"
  })
  export class TestComponent {
    public name = "World";
    public openedModal: NgbModalRef;
    public show = true;
    @ViewChild("content") public tplContent;
    @ViewChild("destroyableContent") public tplDestroyableContent;
    @ViewChild("contentWithClose") public tplContentWithClose;
    @ViewChild("contentWithDismiss") public tplContentWithDismiss;
    @ViewChild("contentWithImplicitContext") public tplContentWithImplicitContext;
    @ViewChild("contentWithIf") public tplContentWithIf;

    constructor(public modalService: NgbModalService) {}

    public open(content: string, options?: any) {
      this.openedModal = this.modalService.open(content, options);
      return this.openedModal;
    }
    public close() {
      if (this.openedModal) {
        this.openedModal.close("ok");
      }
    }
    public dismissAll(reason?: any) { this.modalService.dismissAll(reason); }
    public openTpl(options?: any) { return this.modalService.open(this.tplContent, options); }
    public openCmpt(cmptType: any, options?: any) { return this.modalService.open(cmptType, options); }
    public openDestroyableTpl(options?: any) { return this.modalService.open(this.tplDestroyableContent, options); }
    public openTplClose(options?: any) { return this.modalService.open(this.tplContentWithClose, options); }
    public openTplDismiss(options?: any) { return this.modalService.open(this.tplContentWithDismiss, options); }
    public openTplImplicitContext(options?: any) {
      return this.modalService.open(this.tplContentWithImplicitContext, options);
    }
    public openTplIf(options?: any) { return this.modalService.open(this.tplContentWithIf, options); }
  }
