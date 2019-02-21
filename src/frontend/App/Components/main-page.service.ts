import { IHttpPromiseCallbackArg, IHttpService } from "angular";
import { ELanguages } from "./definitions";

export class MainPageService {
    /**
     * Define dependencies
     */
    public static $inject = ["gettextCatalog", "$http"];

    private currentLoadedLanguages: string[] = [];
    private currentLanguageCode: string = "";

    constructor(
        private gettextCatalog: angular.gettext.gettextCatalog,
        private $http: IHttpService
    ) { }

    public setLanguage(language: ELanguages) {
        const languageCode = this.getLanguageCode(language);
        if (languageCode !== this.currentLanguageCode) {
            this.currentLanguageCode = languageCode;
            if (this.currentLoadedLanguages.every((item) => item !== languageCode)) {
                this.loadStrings(languageCode);
            } else {
                this.gettextCatalog.setCurrentLanguage(languageCode);
            }
        }
    }

    private loadStrings(languageCode: string) {
        this.currentLoadedLanguages.push(languageCode);
        this.$http.get(`translations/${languageCode}.json`)
            .then((resp: IHttpPromiseCallbackArg<any>) => {
                this.gettextCatalog.setStrings(languageCode, resp.data[languageCode]);
                this.gettextCatalog.setCurrentLanguage(languageCode);
            });
    }

    private getLanguageCode(language: ELanguages): string {
        switch (language) {
            case ELanguages.English:
                return "en";
            case ELanguages.Klingon:
                return "kl";
            default:
                return "en";
        }
    }
}
