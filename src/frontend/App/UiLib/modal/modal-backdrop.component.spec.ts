import { TestBed } from "@angular/core/testing";
import { CustomMatchers } from "../../../../../test/CustomMatchers";
import { NgbModalBackdropComponent } from "./modal-backdrop.component";

describe("ngb-modal-backdrop", () => {

  beforeAll(() => {
      jasmine.addMatchers(CustomMatchers);
  });

  beforeEach(() => { TestBed.configureTestingModule({declarations: [NgbModalBackdropComponent]}); });

  it("should render backdrop with required CSS classes", () => {
    const fixture = TestBed.createComponent(NgbModalBackdropComponent);

    fixture.detectChanges();
    expect(fixture.nativeElement).toHaveCssClass("modal-backdrop");
  });
});
