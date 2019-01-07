import "@uirouter/angularjs";
import * as angular from "angular";
import "angular-animate";

import { COMPONENTS_MODULE_NAME } from "./Components";

import { Routes } from "./Routes";

export let app = angular
    .module("myApp", [ "ui.router", COMPONENTS_MODULE_NAME ] )
    .config(Routes);

angular.element(document).ready(() => {
    angular.bootstrap(document.body, [app.name]);
});
