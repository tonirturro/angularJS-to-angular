import uiRouter from "@uirouter/angularjs";
import * as angular from "angular";
import { IComponentOptions } from "angular";
import { Routes } from "./routes";

export const ROUTES_MODULE_NAME = angular.module("myApp.routes", [ uiRouter ])
    .component("deviceEditWrapper", {
        bindings: {
            selectedDeviceId: "<"
        },
        template: `<device-edit [selected-device-id]="$ctrl.selectedDeviceId"></device-edit>`
    } as IComponentOptions)
    .component("pageGridWrapper", {
        bindings: {
            selectedDeviceId: "<"
        },
        template: `<page-grid [selected-device-id]="$ctrl.selectedDeviceId"></page-grid>`
    } as IComponentOptions)
    .config(Routes)
    .name;
