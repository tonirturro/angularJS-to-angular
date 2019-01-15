import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { downgradeInjectable, UpgradeModule } from "@angular/upgrade/static";

import * as angular from "angular";
import { moduleJs } from "./app.modulejs";

import { AppServicesModule } from "./Services";
import { Data } from "./Services/data.service";

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        AppServicesModule
    ],
    providers: [ Data ]
})
export class AppModule {
    constructor(private upgrade: UpgradeModule) { }
    public ngDoBootstrap() {

      // Downgrades
      angular.module(moduleJs)
        .factory("dataService", downgradeInjectable(Data));

      this.upgrade.bootstrap(document.body, [moduleJs], { strictDi: true });
    }
}
