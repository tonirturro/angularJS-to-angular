declare const require: any;

// load jquery
// tslint:disable-next-line: no-var-requires
require("jquery");

// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import "zone.js/dist/zone-testing";

import { getTestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Then we find all the tests.
const contextApp = require.context("../src/frontend/App", true, /\.spec.ts$/);
// And load the modules.
contextApp.keys().map(contextApp);
