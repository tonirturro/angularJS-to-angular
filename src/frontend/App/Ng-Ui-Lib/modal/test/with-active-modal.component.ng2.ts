import { Component } from "@angular/core";

import { NgbActiveModal } from "../..";

@Component({
    selector: "modal-content-cmpt",
    template: "./with-active-modal.component.html"
})
export class WithActiveModalComponent {
  constructor(public activeModal: NgbActiveModal) {}

  public close() { this.activeModal.close("from inside"); }
}
