import { TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { ELanguages, ILanguageParam } from "../../Components/definitions";
import { NgbActiveModal } from "../../Ng-Ui-Lib";
import { SettingsDialogComponent } from "./settings-dialog.component.ng2";

describe("Given a settings dialog component", () => {

    let element: Element;
    let component: SettingsDialogComponent;
    let modal: NgbActiveModal;

    const translations: any = { STR_Apply: "This is a test" };

    class FakeLoader implements TranslateLoader {
        public getTranslation(lang: string): Observable<any> {
            return of(translations);
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ SettingsDialogComponent ],
            imports: [
                FormsModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader}
                })

            ],
            providers: [ NgbActiveModal ]

        });
        const fixture = TestBed.createComponent(SettingsDialogComponent);
        modal = TestBed.get(NgbActiveModal);
        component = fixture.componentInstance;
        component.params = {
                language: ELanguages.Klingon
            } as ILanguageParam;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it("When created Then it has the html defined", () => {
        expect(element.innerHTML.includes("modal-body")).toBeTruthy();
    });

    it("When setting a language Then it is selected", () => {
        expect(Number.parseInt(component.languageOption, 10)).toEqual(component.params.language);
    });

    it("When clicking on first button Then the close method is called", () => {
        const closeSpy = spyOn(modal, "close");
        const firstButton = element.querySelectorAll("button").item(0);

        firstButton.click();

        expect(closeSpy).toHaveBeenCalledWith(component.params.language);
    });

    it("When clicking on second button Then the dismiss method is called", () => {
        const dismissSpy = spyOn(modal, "dismiss");
        const secondButton = element.querySelectorAll("button").item(1);

        secondButton.click();

        expect(dismissSpy).toHaveBeenCalled();
    });
});
