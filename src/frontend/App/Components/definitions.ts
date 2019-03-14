export enum ELanguages {
    English,
    Klingon
}

export interface IMessageParam {
    message: string;
}

export interface ILanguageParam {
    language: ELanguages;
}

export interface INgTranslateService {
    /**
     * Sets the language to be used in order to read the localized strings
     * @param language the language to be used
     */
    setLanguage(language: ELanguages);
}
