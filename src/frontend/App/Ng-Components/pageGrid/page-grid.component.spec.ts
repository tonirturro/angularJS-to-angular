import { TestBed } from "@angular/core/testing";
import { PageGridComponent } from "./page-grid.component.ng2";

describe("Given a page grid controller", () => {

    let element: Element;

    beforeEach(() => {
        TestBed.configureTestingModule({ declarations: [ PageGridComponent ] });
        const fixture = TestBed.createComponent(PageGridComponent);
        element = fixture.nativeElement;
    });

    it("When created Then it has the html defined", () => {
        expect(element.innerHTML).toBeDefined();
    });
});
