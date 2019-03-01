import { TestBed } from "@angular/core/testing";
import { ConfirmationDialogComponent } from "./confirmation-dialog.component.ng2";

describe("Given a confirmation dialog component", () => {

    let element: Element;
    let component: ConfirmationDialogComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [ ConfirmationDialogComponent]});
        const fixture = TestBed.createComponent(ConfirmationDialogComponent);
        component = fixture.componentInstance;
        component.resolve  = {
            params: {
                message: "Message"
            }
        };
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it("When created Then it has the html defined", () => {
        expect(element.innerHTML).toContain("modal-body");
    });

    it("When created Then it contains the message at h2 header", () => {
        expect(element.querySelector("h2").innerText).toEqual(component.resolve.params.message);
    });

    it("When clicking on first button Then the close method is called", () => {
        let closed = false;
        const firstButton = element.querySelectorAll("button").item(0);
        component.close.subscribe(() => {
            closed = true;
        });

        firstButton.click();

        expect(closed).toBeTruthy();
    });

    it("When clicking on second button Then the dismiss method is called", () => {
        let dismissed = false;
        const secondButton = element.querySelectorAll("button").item(1);
        component.dismiss.subscribe(() => {
            dismissed = true;
        });

        secondButton.click();

        expect(dismissed).toBeTruthy();
    });
});
