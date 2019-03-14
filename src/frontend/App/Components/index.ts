import * as angular from "angular";
import "angular-gettext";

import "../templates";

import { UI_LIB_NAME } from "../UiLib";
import { LocalizationService } from "./localization.service";
import { MainPage } from "./main-page.component";

export enum EModals {
    Confimation = "confirmation",
    Settings = "settings"
}

export const COMPONENTS_MODULE_NAME = angular.module(
        "myApp.components",
        [ "templates", "ui.router", "gettext", UI_LIB_NAME ])
    .service("localizationService", LocalizationService)
    .component("mainPage", MainPage)
    .name;
