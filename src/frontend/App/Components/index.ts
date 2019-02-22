import * as angular from "angular";
import "angular-gettext";

import "../UiLib/styles";

import "../templates";

import { UI_LIB_NAME } from "../UiLib";
import { IModalSettings } from "../UiLib/definitions";
import { ModalManager } from "../UiLib/modal/services/modal-manager.service";
import { ConfirmationDialog } from "./confirmationDialog/confirmation-dialog.component";
import { DeviceEdit } from "./deviceEdit/device-edit.component";
import { DevicePanel } from "./devicePanel/device-panel.component";
import { MainPage } from "./main-page.component";
import { MainPageService } from "./main-page.service";
import { PageGrid } from "./pageGrid/page-grid.component";
import { PageGridService } from "./pageGrid/page-grid.service";
import { SettingsDialog } from "./settingsDialog/settings-dialog.component";
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
    { name: EModals.Confimation, settings: { component: "confirmationDialog", size: "md" }},
    { name: EModals.Settings, settings: { component: "settingsDialog" }},
];

const getModal = (name: EModals) => modals.find((modal) => modal.name === name).settings.component;

export const COMPONENTS_MODULE_NAME = angular.module(
        "myApp.components",
        [ "templates", "ui.router", "gettext", UI_LIB_NAME ])
    .service("mainPageService", MainPageService)
    .service("pageGridService", PageGridService)
    .component(getModal(EModals.Confimation), ConfirmationDialog)
    .component(getModal(EModals.Settings), SettingsDialog)
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
