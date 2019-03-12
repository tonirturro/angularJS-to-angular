import { IHttpPromiseCallbackArg, IHttpService } from "angular";
import { Observable, Subject } from "rxjs";

import { ISelectableOption } from "../../../common/rest";

import { ELanguages, INgTranslateService } from "./definitions";

export class LocalizationService {
    /**
     * Define dependencies
     */
    public static $inject = ["gettextCatalog", "$http", "ngTranslateService"];

    private currentLoadedLanguages: string[] = [];
    private currentLanguageCode: string = "";
    private readonly languageSubject: Subject<any> = new Subject<any>();

    public get language$(): Observable<any> {
        return this.languageSubject;
    }

    public get closeMessage(): string {
        return this.gettextCatalog.getString("STR_Close_Message");
    }

    public get deviceName(): string {
        return this.gettextCatalog.getString("STR_Device");
    }

    public get deleteDeviceMessage(): string {
        return this.gettextCatalog.getString("STR_DeleteDevice");
    }

    constructor(
        private gettextCatalog: angular.gettext.gettextCatalog,
        private $http: IHttpService,
        private ngTranslateService: INgTranslateService
    ) {}

    public setLanguage(language: ELanguages) {
        const languageCode = this.getLanguageCode(language);
        if (languageCode !== this.currentLanguageCode) {
            this.currentLanguageCode = languageCode;
            this.ngTranslateService.setLanguage(language);
            if (this.currentLoadedLanguages.every((item) => item !== languageCode)) {
                this.loadStrings(languageCode);
            } else {
                this.gettextCatalog.setCurrentLanguage(languageCode);
                this.languageSubject.next();
            }
        }
    }

    public getLocalizedCapability(capability: ISelectableOption): ISelectableOption {
        const localizationKey = `STR_${capability.label}`;
        return {
            label: this.gettextCatalog.getString(localizationKey),
            value: capability.value
        } as ISelectableOption;
    }

    private loadStrings(languageCode: string) {
        this.currentLoadedLanguages.push(languageCode);
        this.$http.get(`translations/${languageCode}.json`)
            .then((resp: IHttpPromiseCallbackArg<any>) => {
                this.gettextCatalog.setStrings(languageCode, resp.data[languageCode]);
                this.gettextCatalog.setCurrentLanguage(languageCode);
                this.languageSubject.next();
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
