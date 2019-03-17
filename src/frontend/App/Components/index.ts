import * as angular from "angular";
import "angular-gettext";

import "../templates";

import "../UiLib/styles";

import { LocalizationService } from "./localization.service";
import { MainPage } from "./main-page.component";

export enum EModals {
    Confimation = "confirmation",
    Settings = "settings"
}

export const COMPONENTS_MODULE_NAME = angular.module(
        "myApp.components",
        [ "templates", "gettext"])
    .service("localizationService", LocalizationService)
    .component("mainPage", MainPage)
    .name;
