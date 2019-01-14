// load jquery
require('jquery');
// load the code
require("../src/frontend/App/app.modulejs");

// Load AngularJS test dependencies
require("angular-mocks");

// Load Angular test dependencies
Error.stackTraceLimit = Infinity;

require('core-js/es7/reflect');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

// Load the tests
const contextApp = require.context("../src/frontend/App", true, /\.spec.ts$/);
contextApp.keys().map(contextApp);

// Init Angular test environment
var testing = require('@angular/core/testing');
var browser = require('@angular/platform-browser-dynamic/testing');

testing.TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());