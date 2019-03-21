import { Component } from "@angular/core";
import { NgbModalService } from "../..";

@Component({
    selector: "test-a11y-cmpt",
    templateUrl: "./test-a11y-component.html"
  })
export class TestA11yComponent {
    constructor(private modalService: NgbModalService) {}

    public open(options?: any) { return this.modalService.open("foo", options); }
}
