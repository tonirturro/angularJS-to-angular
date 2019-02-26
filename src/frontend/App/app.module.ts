import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { downgradeComponent, downgradeInjectable, UpgradeModule } from "@angular/upgrade/static";

import * as angular from "angular";
import { moduleJs } from "./app.modulejs";

import { EModals, getModal } from "./Components";
import { ComponentsModule, ConfirmationDialogComponent } from "./Ng-Components";
import { DataService } from "./Services/data.service";

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        ComponentsModule
    ]
})
export class AppModule {
    constructor(private upgrade: UpgradeModule) { }
    public ngDoBootstrap() {

      // Downgrades
      angular.module(moduleJs)
        .factory("dataService", downgradeInjectable(DataService))
        .directive(
          getModal(EModals.Confimation),
          downgradeComponent({ component: ConfirmationDialogComponent }) as angular.IDirectiveFactory);

      this.upgrade.bootstrap(document.body, [moduleJs], { strictDi: true });
    }
}
