import { TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { ELanguages, IDialogParam, ILanguageParam } from "../../Components/definitions";
import { SettingsDialogComponent } from "./settings-dialog.component.ng2";

describe("Given a settings dialog component", () => {

    let element: Element;
    let component: SettingsDialogComponent;

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
        });
        const fixture = TestBed.createComponent(SettingsDialogComponent);
        component = fixture.componentInstance;
        component.resolve = {
            params: {
                language: ELanguages.Klingon
            }
        } as IDialogParam<ILanguageParam>;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it("When created Then it has the html defined", () => {
        expect(element.innerHTML.includes("modal-body")).toBeTruthy();
    });

    it("When setting a language Then it is selected", () => {
        expect(Number.parseInt(component.languageOption, 10)).toEqual(component.resolve.params.language);
    });

    it("When clicking on first button Then the close method is called", () => {
        let returnedValue: ELanguages;
        const firstButton = element.querySelectorAll("button").item(0);
        component.close.subscribe((result: ELanguages) => {
            returnedValue = result;
        });

        firstButton.click();

        expect(returnedValue).toEqual(component.resolve.params.language);
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
