import * as angular from "angular";
import "angular-gettext";

import "../UiLib/styles";

import "../templates";

import { UI_LIB_NAME } from "../UiLib";
import { IModalSettings } from "../UiLib/definitions";
import { ModalManager } from "../UiLib/modal/services/modal-manager.service";
import { DeviceEdit } from "./deviceEdit/device-edit.component";
import { DevicePanel } from "./devicePanel/device-panel.component";
import { LocalizationService } from "./localization.service";
import { MainPage } from "./main-page.component";
import { PageGrid } from "./pageGrid/page-grid.component";
import { ToolBar } from "./toolBar/toolbar.component";

export enum EModals {
    Confimation = "confirmation",
    Settings = "settings"
}

interface IModalDefinition {
    name: EModals;
    settings: IModalSettings;
}

const modals: IModalDefinition[] = [
    { name: EModals.Confimation, settings: { component: "confirmationDialog", size: "md", downgradedComponent: true }},
    { name: EModals.Settings, settings: { component: "settingsDialog", downgradedComponent: true }},
];

export const getModal = (name: EModals) => modals.find((modal) => modal.name === name).settings.component;

export const COMPONENTS_MODULE_NAME = angular.module(
        "myApp.components",
        [ "templates", "ui.router", "gettext", UI_LIB_NAME ])
    .service("localizationService", LocalizationService)
    .component("toolbar", ToolBar)
    .component("devicePanel", DevicePanel)
    .component("deviceEdit", DeviceEdit)
    .component("pageGrid", PageGrid)
    .component("mainPage", MainPage)
    .run(["modalManager", (modalManager: ModalManager) => {
        modals.forEach((modal: IModalDefinition) => {
            modalManager.register(modal.name, modal.settings);
        });
    }])
    .name;
