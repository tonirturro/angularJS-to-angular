import * as angular from "angular";
import { DataService } from "./DataService";

export const SERVICES_MODULE_NAME = angular.module("myApp.services", [])
    .service("dataService", DataService)
    .name;
