import * as angular from "angular";
import { ELanguages, INgTranslateService } from "./definitions";

export class NgTranslateServiceMock implements INgTranslateService {
    public setLanguage(language: ELanguages) {
        angular.noop(language);
    }
}
