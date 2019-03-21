import "./polyfills";

import "./angular-modules";

import "./UiLib/styles/bootstrap.scss";

import "./app.styles.css";

import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app.module";

declare var PRODUCTION: boolean;
if (PRODUCTION) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
