import * as angular from "angular";

import "../UiLib/styles";

import "../templates";

import { downgradeInjectable } from "@angular/upgrade/static";
import { Data } from "../Services/data";

import { UI_LIB_NAME } from "../UiLib";
import { CloseDialog } from "./closeDialog/close-dialog.component";
import { DeleteDeviceDialog } from "./deleteDevice/delete-device-dialog.component";
import { DeviceEdit } from "./deviceEdit/device-edit.component";
import { DevicePanel } from "./devicePanel/device-panel.component";
import { MainPage } from "./main-page.component";
import { PageGrid } from "./pageGrid/page-grid.component";
import { ToolBar } from "./toolBar/toolbar.component";

export const COMPONENTS_MODULE_NAME = angular.module(
        "myApp.components",
        [ "templates", "ui.router", UI_LIB_NAME ])
    .component("closeDialog", CloseDialog)
    .component("deleteDeviceDialog", DeleteDeviceDialog)
    .component("toolbar", ToolBar)
    .component("devicePanel", DevicePanel)
    .component("deviceEdit", DeviceEdit)
    .component("pageGrid", PageGrid)
    .component("mainPage", MainPage)
    .name;
