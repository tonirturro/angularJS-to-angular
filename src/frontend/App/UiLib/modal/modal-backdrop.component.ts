import {Component, Input} from "@angular/core";

@Component({
  host: {
    "[class]": "\"modal-backdrop fade show\" + (backdropClass ? \" \" + backdropClass : \"\")", "style": "z-index: 1050"
  },
  selector: "ngb-modal-backdrop",
  template: "",
})

export class NgbModalBackdropComponent {
  @Input() public backdropClass: string;
}
