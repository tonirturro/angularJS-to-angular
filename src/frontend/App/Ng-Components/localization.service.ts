import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { ISelectableOption } from "../../../common/rest";
import { ELanguages } from "./definitions";

@Injectable({providedIn: "root"})
export class LocalizationService {

    private currentLanguageCode: string = "";
    private readonly languageSubject: Subject<any> = new Subject<any>();

    constructor(private translationService: TranslateService) {
        this.translationService.setDefaultLang(this.getLanguageCode(ELanguages.English));
    }

    public get language$(): Observable<any> {
        return this.languageSubject;
    }

    /**
     * Sets the language to be used in order to read the localized strings
     * @param language the language to be used
     */
    public setLanguage(language: ELanguages) {
        const languageCode = this.getLanguageCode(language);
        if (languageCode !== this.currentLanguageCode) {
            this.currentLanguageCode = languageCode;
            this.translationService.use(languageCode).subscribe(() => {
                this.languageSubject.next();
            });
        }
    }

    /**
     * Matches a capability with its correspondig string and returns it
     * @param capability the capability name for the setting to be translated
     */
    public getLocalizedCapability(capability: ISelectableOption): Observable<ISelectableOption> {
        const localizationKey = `STR_${capability.label}`;
        return this.translationService.get(localizationKey)
            .pipe(map((translation) => {
                return {
                    label: translation,
                    value: capability.value
                } as ISelectableOption;
            }));
    }

    public get closeMessage(): Observable<string> {
        return this.translationService.get("STR_Close_Message");
    }

    public get deviceName(): Observable<string> {
        return this.translationService.get("STR_Device");
    }

    public get deleteDeviceMessage(): Observable<string> {
        return this.translationService.get("STR_DeleteDevice");
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
