import * as angular from "angular";
import { IHttpService, IQService, IRootScopeService } from "angular";
import { ELanguages } from "./definitions";
import { MainPageService } from "./main-page.service";

describe("Given a main page service", () => {
    const expectedEnglishLanguageCode = "en";
    const expectedStrings = {
        data: {
            en: {}
        }
    };
    let service: MainPageService;
    let rootScope: IRootScopeService;
    let httpGetMock: jasmine.Spy;
    let loadStringsMock: jasmine.Spy;
    let setLanguageMock: jasmine.Spy;

    beforeEach(angular.mock.module("myApp.components"));

    beforeEach(inject((
        mainPageService: MainPageService,
        $http: IHttpService,
        $q: IQService,
        $rootScope: IRootScopeService,
        gettextCatalog: angular.gettext.gettextCatalog
    ) => {
        service = mainPageService;
        rootScope = $rootScope;
        httpGetMock = spyOn($http, "get").and.returnValue($q.resolve(expectedStrings));
        loadStringsMock = spyOn(gettextCatalog, "setStrings");
        setLanguageMock = spyOn(gettextCatalog, "setCurrentLanguage");
    }));

    it("When setting the language Then definitions are queried", () => {
        const expectedGetUrl = `translations/${expectedEnglishLanguageCode}.json`;

        service.setLanguage(ELanguages.English);

        expect(httpGetMock).toHaveBeenCalledWith(expectedGetUrl);
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
    });

    it("When setting the same language Then the current language is not set", () => {
        service.setLanguage(ELanguages.English);
        rootScope.$apply();

        service.setLanguage(ELanguages.English);
        rootScope.$apply();

        expect(setLanguageMock).toHaveBeenCalledTimes(1);
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
    });
});
