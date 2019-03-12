import { TestBed } from "@angular/core/testing";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { AppServicesModule } from "../../Services";
import { PageGridComponent } from "./page-grid.component.ng2";

describe("Given a page grid controller", () => {

    const translations: any = { STR_Any: "This is a test" };

    let element: Element;

    class FakeLoader implements TranslateLoader {
        public getTranslation(lang: string): Observable<any> {
            return of(translations);
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ PageGridComponent ],
            imports: [
                AppServicesModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader}
                })
             ]
        });
        const fixture = TestBed.createComponent(PageGridComponent);
        element = fixture.nativeElement;
    });

    it("When created Then it has the html defined", () => {
        expect(element.innerHTML).toBeDefined();
    });
});
