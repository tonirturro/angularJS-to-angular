import * as angular from "angular";
import { Observable, of } from "rxjs";
import { INgTranslateService } from "../Services/definitions";

export class NgTranslateServiceMock implements INgTranslateService {
    public setDefaultLang(lang: string) {
        angular.noop(lang);
    }
    public getDefaultLang(): string {
        return "en";
    }
    public use(lang: string): Observable<any> {
        return of(lang);
    }
}
