import { TestBed } from "@angular/core/testing";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { ISelectableOption } from "../../../common/rest";
import { ELanguages } from "./definitions";
import { LocalizationService } from "./localization.service";

describe("Given a localization service", () => {

    const expectedEnglishLanguageCode = "en";
    const capability: ISelectableOption = {
        label: "Name",
        value: "0"
    };
    let service: LocalizationService;
    let translateService: TranslateService;
    let setLanguageMock: jasmine.Spy;

    const translations: any = {
        STR_Close_Message: "str1",
        STR_DeleteDevice: "str2",
        STR_Device: "str3",
    };

    class FakeLoader implements TranslateLoader {
        public getTranslation(lang: string): Observable<any> {
            return of(translations);
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader }
                })
            ],
            providers: [ LocalizationService ]
        });

        service = TestBed.get(LocalizationService);
        translateService = TestBed.get(TranslateService);
        setLanguageMock = spyOn(translateService, "use").and.returnValue(of({}));
    });

    it("When setting the language Then the current language is set", () => {
        service.setLanguage(ELanguages.English);

        expect(setLanguageMock).toHaveBeenCalledWith(expectedEnglishLanguageCode);
    });

    it("When setting the language Then the change is broadcasted", (done) => {
        service.language$.subscribe(() => {
            done();
        });

        service.setLanguage(ELanguages.English);
    });

    it("When setting the same language Then the current language is not set", () => {
        service.setLanguage(ELanguages.English);
        service.setLanguage(ELanguages.English);

        expect(setLanguageMock).toHaveBeenCalledTimes(1);
    });

    it("When asking for a capability literal Then the localization service is called", () => {
        const getStringMock = spyOn(translateService, "get").and.returnValue(of(""));
        const expectedLocalizationKey =  `STR_${capability.label}`;

        service.getLocalizedCapability(capability).subscribe();

        expect(getStringMock).toHaveBeenCalledWith(expectedLocalizationKey);
    });

    it("When asking for a capability literal Then the capability is returned translated", (done) => {
        const translatedLabel = "translated";
        spyOn(translateService, "get").and.returnValue(of(translatedLabel));

        service.getLocalizedCapability(capability).subscribe((translatedCapability) => {
            expect(translatedCapability.value).toEqual(capability.value);
            expect(translatedCapability.label).toEqual(translatedLabel);
            done();
        });
    });

    it("When asking for the close message Then we get the correct translation", (done) => {
        const strValue = "STR_Close_Message";

        service.closeMessage.subscribe((translation) => {
            expect(translation).toEqual(translations[strValue]);
            done();
        });
    });

    it("When asking for the delete device message Then we get the correct translation", (done) => {
        const strValue = "STR_DeleteDevice";

        service.deleteDeviceMessage.subscribe((translation) => {
            expect(translation).toEqual(translations[strValue]);
            done();
        });
    });

    it("When asking for the device name message Then we get the correct translation", (done) => {
        const strValue = "STR_Device";

        service.deviceName.subscribe((translation) => {
            expect(translation).toEqual(translations[strValue]);
            done();
        });
    });
});
