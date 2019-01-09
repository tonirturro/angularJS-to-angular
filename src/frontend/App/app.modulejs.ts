import "@uirouter/angularjs";
import * as angular from "angular";
import "angular-animate";

import { COMPONENTS_MODULE_NAME } from "./Components";

import { Routes } from "./Routes";

export let moduleJs = angular
    .module("myApp", [ "ui.router", COMPONENTS_MODULE_NAME ] )
    .config(Routes).name;
