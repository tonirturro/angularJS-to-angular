// polyfills
import "core-js/es7/reflect";

import "zone.js/dist/zone";

// vendor
import "@angular/platform-browser";

import "@angular/platform-browser-dynamic";

import "@angular/core";

import "@angular/common";

import "@angular/http";

import "@angular/router";

import "@angular/forms";

import "@angular/upgrade/static";

// Dual boot
import { setAngularLib } from "@angular/upgrade/static";
import * as angular from "angular";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app.module";

setAngularLib(angular);
platformBrowserDynamic().bootstrapModule(AppModule);
