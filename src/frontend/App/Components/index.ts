import * as angular from "angular";

import "../UiLib/styles";

import "../templates";

import { UI_LIB_NAME } from "../UiLib";
import { IModalSettings } from "../UiLib/definitions";
import { CloseDialog } from "./closeDialog/close-dialog.component";
import { ConfirmationDialog } from "./confirmationDialog/confirmation-dialog.component";
import { DeleteDeviceDialog } from "./deleteDevice/delete-device-dialog.component";
import { DeviceEdit } from "./deviceEdit/device-edit.component";
import { DevicePanel } from "./devicePanel/device-panel.component";
import { MainPage } from "./main-page.component";
import { PageGrid } from "./pageGrid/page-grid.component";
import { ToolBar } from "./toolBar/toolbar.component";

export enum EModals {
    Confimation = "confirmation"
}

interface IModalDefinition {
    name: EModals;
    settings: IModalSettings;
}

const modals: IModalDefinition[] = [
    { name: EModals.Confimation, settings: { component: "confirmationDialog", size: "md" }}
];

const getModal = (name: EModals) => modals.find((modal) => modal.name === name).settings.component;

export const COMPONENTS_MODULE_NAME = angular.module(
        "myApp.components",
        [ "templates", "ui.router", UI_LIB_NAME ])
    .component(getModal(EModals.Confimation), ConfirmationDialog)
    .component("closeDialog", CloseDialog)
    .component("deleteDeviceDialog", DeleteDeviceDialog)
    .component("toolbar", ToolBar)
    .component("devicePanel", DevicePanel)
    .component("deviceEdit", DeviceEdit)
    .component("pageGrid", PageGrid)
    .component("mainPage", MainPage)
    .name;
