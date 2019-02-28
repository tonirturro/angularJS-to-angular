import { IProvideService } from "@angular/upgrade/static/src/common/angular1";
import * as angular from "angular";
import { IHttpService, IQService, IRootScopeService } from "angular";
import { of } from "rxjs";
import { ISelectableOption } from "../../../common/rest";
import { DataServiceMock } from "../Services/data.service.mock";
import { INgTranslateService } from "../Services/definitions";
import { ELanguages } from "./definitions";
import { LocalizationService } from "./localization.service";
import { NgTranslateServiceMock } from "./ng-translate.service.mock";

describe("Given a localization service", () => {
    const expectedEnglishLanguageCode = "en";
    const expectedStrings = {
        data: {
            en: {}
        }
    };
    const capability: ISelectableOption = {
        label: "Name",
        value: "0"
    };
    let service: LocalizationService;
    let rootScope: IRootScopeService;
    let httpGetMock: jasmine.Spy;
    let loadStringsMock: jasmine.Spy;
    let setLanguageMock: jasmine.Spy;
    let setNgLanguageMock: jasmine.Spy;
    let getStringMock: jasmine.Spy;

    beforeEach(angular.mock.module("myApp.components", ($provide: IProvideService) => {
        $provide.value("dataService", new DataServiceMock());
        $provide.value("ngTranslateService", new NgTranslateServiceMock());
    }));

    beforeEach(inject((
        localizationService: LocalizationService,
        $http: IHttpService,
        $q: IQService,
        $rootScope: IRootScopeService,
        gettextCatalog: angular.gettext.gettextCatalog,
        ngTranslateService: INgTranslateService
    ) => {
        service = localizationService;
        rootScope = $rootScope;
        httpGetMock = spyOn($http, "get").and.returnValue($q.resolve(expectedStrings));
        loadStringsMock = spyOn(gettextCatalog, "setStrings");
        setLanguageMock = spyOn(gettextCatalog, "setCurrentLanguage");
        setNgLanguageMock = spyOn(ngTranslateService, "use").and.returnValue(of({}));
        getStringMock = spyOn(gettextCatalog, "getString");
    }));

    it("When setting the language Then definitions are queried", () => {
        const expectedGetUrl = `translations/${expectedEnglishLanguageCode}.json`;

        service.setLanguage(ELanguages.English);

        expect(httpGetMock).toHaveBeenCalledWith(expectedGetUrl);
    });

    it("When setting the language Then the change is broadcasted", (done) => {
        service.language$.subscribe(() => {
            done();
        });

        service.setLanguage(ELanguages.English);
        rootScope.$apply();
    });

    it("When setting the language Then strings are set", () => {
        service.setLanguage(ELanguages.English);
        rootScope.$apply();

        expect(loadStringsMock)
            .toHaveBeenCalledWith(expectedEnglishLanguageCode, expectedStrings.data[expectedEnglishLanguageCode]);
    });

    it("When setting the language Then the current language is set", () => {
        service.setLanguage(ELanguages.English);
        rootScope.$apply();

        expect(setLanguageMock).toHaveBeenCalledWith(expectedEnglishLanguageCode);
        expect(setNgLanguageMock).toHaveBeenCalledWith(expectedEnglishLanguageCode);
    });

    it("When setting the same language Then the current language is not set", () => {
        service.setLanguage(ELanguages.English);
        rootScope.$apply();

        service.setLanguage(ELanguages.English);
        rootScope.$apply();

        expect(setLanguageMock).toHaveBeenCalledTimes(1);
        expect(setNgLanguageMock).toHaveBeenCalledTimes(1);
    });

    it("When setting an already language Then the current language not set but not loaded", () => {
        service.setLanguage(ELanguages.English);
        rootScope.$apply();
        service.setLanguage(ELanguages.Klingon);
        rootScope.$apply();

        service.setLanguage(ELanguages.English);
        rootScope.$apply();

        expect(loadStringsMock).toHaveBeenCalledTimes(2);
        expect(setLanguageMock).toHaveBeenCalledTimes(3);
        expect(setNgLanguageMock).toHaveBeenCalledTimes(3);
    });

    it("When asking for a capability literal Then the localization service is called", () => {
        const expectedLocalizationKey =  `STR_${capability.label}`;

        service.getLocalizedCapability(capability);

        expect(getStringMock).toHaveBeenCalledWith(expectedLocalizationKey);
    });

    it("When asking for a capability literal Then it returns the expected localization", () => {
        const expectedLocalizedCapability: ISelectableOption =  {
            label: "Translated Name",
            value: capability.value
        };
        getStringMock.and.returnValue(expectedLocalizedCapability.label);

        const localizedCapability = service.getLocalizedCapability(capability);

        expect(localizedCapability).toEqual(expectedLocalizedCapability);
    });
});
