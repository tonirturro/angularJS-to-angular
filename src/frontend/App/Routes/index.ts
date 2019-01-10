import "@uirouter/angularjs";
import * as angular from "angular";
import { UI_LIB_NAME } from "../UiLib";
import { ModalStateProvider } from "./modal-state-provider";
import { Routes } from "./routes";

export const ROUTES_MODULE_NAME = angular.module("myApp.routes", [ "ui.router",  UI_LIB_NAME ])
    .provider("modalState", ModalStateProvider)
    .config(Routes)
    .name;
