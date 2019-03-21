import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { NgbTooltipDirective } from "../../UiLib";
import { ToolBarComponent } from "./toolbar.component";

enum ButtonPosition {
    AddDevice, EditDevice, EditPages, Settings, Close
}

describe("Given a toolbar component", () => {

    let element: Element;
    let component: ToolBarComponent;
    let fixture: ComponentFixture<ToolBarComponent>;

    const translations: any = {
        STR_Add_Device_Tooltip: "This is a test"
    };

    class FakeLoader implements TranslateLoader {
        public getTranslation(lang: string): Observable<any> {
            return of(translations);
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ ToolBarComponent, NgbTooltipDirective ],
            imports: [
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader }
                })
            ]
        });
        fixture = TestBed.createComponent(ToolBarComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    afterAll(() => {
        NgbTooltipDirective.nextId = 0;
    });

    it("When created Then it has the html defined", () => {
        expect(element.innerHTML).toBeDefined();
    });

    it("When clicking on add device button Then the action is reported", () => {
        let addButtonClick = false;
        const addButton = element.querySelectorAll("button")[ButtonPosition.AddDevice];
        component.onAddDevice.subscribe(() => {
            addButtonClick = true;
        });

        addButton.click();

        expect(addButtonClick).toBeTruthy();
    });

    it("When clicking on edit devices button and whe are editing pages Then the action is reported", () => {
        component.editingDevices = false;
        fixture.detectChanges();
        let editDevicesButtonClick = false;
        const editDevicesButton = element.querySelectorAll("button")[ButtonPosition.EditDevice];
        component.onEditDevices.subscribe(() => {
            editDevicesButtonClick = true;
        });

        editDevicesButton.click();

        expect(editDevicesButtonClick).toBeTruthy();
    });

    it("When clicking on edit devices button and whe are editing devices Then the action is not reported", () => {
        component.editingDevices = true;
        fixture.detectChanges();
        let editDevicesButtonClick = false;
        const editDevicesButton = element.querySelectorAll("button")[ButtonPosition.EditDevice];
        component.onEditPages.subscribe(() => {
            editDevicesButtonClick = true;
        });

        editDevicesButton.click();

        expect(editDevicesButtonClick).toBeFalsy();
    });

    it("When clicking on edit pages button and whe are editing devices Then the action is reported", () => {
        component.editingDevices = true;
        fixture.detectChanges();
        let editPagesButtonClick = false;
        const editPagesButton = element.querySelectorAll("button")[ButtonPosition.EditPages];
        component.onEditPages.subscribe(() => {
            editPagesButtonClick = true;
        });

        editPagesButton.click();

        expect(editPagesButtonClick).toBeTruthy();
    });

    it("When clicking on edit pages button and whe are editind pages Then the action not is reported", () => {
        component.editingDevices = false;
        fixture.detectChanges();
        let editPagesButtonClick = false;
        const editPagesButton = element.querySelectorAll("button")[ButtonPosition.EditPages];
        component.onEditPages.subscribe(() => {
            editPagesButtonClick = true;
        });

        editPagesButton.click();

        expect(editPagesButtonClick).toBeFalsy();
    });

    it("When clicking on settings button Then the action is reported", () => {
        let settingsButtonClick = false;
        const settingsButton = element.querySelectorAll("button")[ButtonPosition.Settings];
        component.onSettings.subscribe(() => {
            settingsButtonClick = true;
        });

        settingsButton.click();

        expect(settingsButtonClick).toBeTruthy();
    });

    it("When clicking on close button Then the action is reported", () => {
        let closeButtonClick = false;
        const closeButton = element.querySelectorAll("button")[ButtonPosition.Close];
        component.onClose.subscribe(() => {
            closeButtonClick = true;
        });

        closeButton.click();

        expect(closeButtonClick).toBeTruthy();
    });
});
