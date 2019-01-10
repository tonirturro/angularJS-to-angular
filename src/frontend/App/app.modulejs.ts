import * as angular from "angular";
import "angular-animate";

import { COMPONENTS_MODULE_NAME } from "./Components";
import { ROUTES_MODULE_NAME } from "./Routes";

export let moduleJs = angular
    .module("myApp", [ ROUTES_MODULE_NAME , COMPONENTS_MODULE_NAME ])
    .name;
