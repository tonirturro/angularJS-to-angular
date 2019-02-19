import "@uirouter/angularjs";
import * as angular from "angular";
import { Routes } from "./routes";

export const ROUTES_MODULE_NAME = angular.module("myApp.routes", [ "ui.router" ])
    .config(Routes)
    .name;
