import * as angular from "angular";
import { UI_LIB_NAME } from "../UiLib";
import { DataService } from "./DataService";
import { ModalStateProvider } from "./ModalStateProvider";

export const SERVICES_MODULE_NAME = angular.module("myApp.services", [ UI_LIB_NAME ])
    .provider("modalState", ModalStateProvider)
    .service("dataService", DataService)
    .name;
