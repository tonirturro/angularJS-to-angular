import * as angular from "angular";
import "angular-animate";

import { COMPONENTS_MODULE_NAME } from "./Components";

export let moduleJs = angular
    .module("myApp", [ COMPONENTS_MODULE_NAME ])
    .name;
