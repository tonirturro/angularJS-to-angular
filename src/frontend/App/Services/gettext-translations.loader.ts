import { HttpClient } from "@angular/common/http";
import { TranslateLoader } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

interface ITranslations {
    [key: string]: string;
}

interface IGettextTranslations {
    [key: string]: ITranslations;
}

export class GettextTranslationsLoader implements TranslateLoader {

    constructor(private http: HttpClient) {}

    public getTranslation(langCode: string): Observable<any> {
        return this.http
            .get(`translations/${langCode}.json`)
            .pipe(map((contents: IGettextTranslations) => this.parse(contents, langCode)));

    }

    private parse(contents: IGettextTranslations, langCode: string): ITranslations {
        return contents[langCode];
    }
}
