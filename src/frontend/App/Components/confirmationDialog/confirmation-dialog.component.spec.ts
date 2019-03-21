import { TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "../../UiLib";
import { ConfirmationDialogComponent } from "./confirmation-dialog.component";

describe("Given a confirmation dialog component", () => {

    let element: Element;
    let component: ConfirmationDialogComponent;
    let modal: NgbActiveModal;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ ConfirmationDialogComponent],
            providers: [ NgbActiveModal ]
        });
        const fixture = TestBed.createComponent(ConfirmationDialogComponent);
        modal = TestBed.get(NgbActiveModal);
        component = fixture.componentInstance;
        component.params = {
            message: "Message"
        };
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it("When created Then it has the html defined", () => {
        expect(element.innerHTML).toContain("modal-body");
    });

    it("When created Then it contains the message at h2 header", () => {
        expect(element.querySelector("h2").innerText).toEqual(component.params.message);
    });

    it("When clicking on first button Then the close method is called", () => {
        const closeSpy = spyOn(modal, "close");
        const firstButton = element.querySelectorAll("button").item(0);

        firstButton.click();

        expect(closeSpy).toHaveBeenCalled();
    });

    it("When clicking on second button Then the dismiss method is called", () => {
        const dismissSpy = spyOn(modal, "dismiss");
        const secondButton = element.querySelectorAll("button").item(1);

        secondButton.click();

        expect(dismissSpy).toHaveBeenCalled();
    });
});
