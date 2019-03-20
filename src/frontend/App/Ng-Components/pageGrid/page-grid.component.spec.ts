import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { Observable, of, Subject } from "rxjs";
import { PageFields } from "../../../../common/model";
import { ISelectableOption } from "../../../../common/rest";
import { NgbTooltipDirective } from "../../Ng-Ui-Lib";
import { AppServicesModule } from "../../Services";
import { DataService } from "../../Services/data.service";
import { LocalizationService } from "../localization.service";
import { PageGridComponent } from "./page-grid.component.ng2";

describe("Given a page grid controller", () => {
    const fakeMouseEvent: any = {
        ctrlKey: false,
        srcElement: {
            attributes: {
                getNamedItem: () => false
            }
        }
    };
    const translations: any = { STR_Any: "This is a test" };
    const capabilities: ISelectableOption[] = [
        {
            label: "capabilityLabel",
            value: "0"
        }
    ];
    const selectedPage: any = {
        id: 1
    };
    const NewValue = "1";
    let fixture: ComponentFixture<PageGridComponent>;
    let element: Element;
    let component: PageGridComponent;
    let updatePageMock: jasmine.Spy;
    let getLocalizedCapabilityMock: jasmine.Spy;
    let getCapabilitiesMock: jasmine.Spy;
    let localizationBroadcast: Subject<any>;

    class FakeLoader implements TranslateLoader {
        public getTranslation(lang: string): Observable<any> {
            return of(translations);
        }
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [PageGridComponent, NgbTooltipDirective ],
            imports: [
                AppServicesModule,
                FormsModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader }
                })
            ],
            providers: [ LocalizationService ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PageGridComponent);
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        const dataService = TestBed.get(DataService);
        updatePageMock = spyOn(dataService, "updatePageField");
        getCapabilitiesMock = spyOn(dataService, "getCapabilities");
        getCapabilitiesMock.and.returnValue(of(capabilities));
        const localizationService = TestBed.get(LocalizationService);
        getLocalizedCapabilityMock = spyOn(localizationService, "getLocalizedCapability");
        getLocalizedCapabilityMock.and.returnValue(of({}));
        localizationBroadcast = localizationService.language$ as Subject<any>;
        fixture.detectChanges();
        component.selectPage(fakeMouseEvent, selectedPage.id );
    });

    afterAll(() => {
        NgbTooltipDirective.nextId = 0;
    });

    it("When created Then it has the html defined", () => {
        expect(element.innerHTML).toBeDefined();
    });

    it("When the component has been initialized Then it observes localization changes", () => {
        expect(localizationBroadcast.observers.length).toEqual(1);
    });

    it("When the component has been initialized " +
        "Then the localization service is called for each one of the capabilites", () => {
            expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.PrintQuality);
            expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.MediaType);
            expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.Destination);
            expect(getLocalizedCapabilityMock).toHaveBeenCalledWith(capabilities[0]);
            expect(getLocalizedCapabilityMock).toHaveBeenCalledTimes(3);
        });

    it("When changing page size Then the corresponding update model call is made", () => {
        component.updatePageSize(NewValue);

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.PageSize, [selectedPage.id], NewValue);
    });

    it("When changing print quality Then the corresponding update model call is made", () => {
        component.updatePrintQuality(NewValue);

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.PrintQuality, [ selectedPage.id ], NewValue);
    });

    it("When changing media type Then the corresponding update model call is made", () => {
        component.updateMediaType(NewValue);

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.MediaType, [ selectedPage.id ], NewValue);
    });

    it("When changing destination Then the corresponding update model call is made", () => {
        component.updateDestination(NewValue);

        expect(updatePageMock)
            .toHaveBeenCalledWith(PageFields.Destination, [ selectedPage.id ], NewValue);
    });

    it("When changing language Then the capabilities are updated", () => {
        getCapabilitiesMock.calls.reset();
        getLocalizedCapabilityMock.calls.reset();

        localizationBroadcast.next();

        expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.PrintQuality);
        expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.MediaType);
        expect(getCapabilitiesMock).toHaveBeenCalledWith(PageFields.Destination);
        expect(getLocalizedCapabilityMock).toHaveBeenCalledWith(capabilities[0]);
        expect(getLocalizedCapabilityMock).toHaveBeenCalledTimes(3);
    });

    it("When the component is destroyed Then it unsubscipts from localization changes", () => {
        fixture.destroy();
        expect(localizationBroadcast.observers.length).toEqual(0);
    });
});
