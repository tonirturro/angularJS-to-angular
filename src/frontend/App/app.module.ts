import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { downgradeComponent, downgradeInjectable, UpgradeModule } from "@angular/upgrade/static";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";

import * as angular from "angular";
import { moduleJs } from "./app.modulejs";

import { EModals, getModal } from "./Components";
import {
  ComponentsModule,
  ConfirmationDialogComponent,
  DevicePanelComponent,
  SettingsDialogComponent } from "./Ng-Components";
import { DataService } from "./Services/data.service";
import { GettextTranslationsLoader } from "./Services/gettext-translations.loader";

// AoT requires an exported function for factories
export function GettextLoaderLoaderFactory(http: HttpClient) {
  return new GettextTranslationsLoader(http);
}

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        HttpClientModule,
        ComponentsModule,
        TranslateModule.forRoot({
          loader: {
            deps: [HttpClient],
            provide: TranslateLoader,
            useFactory: GettextLoaderLoaderFactory
          }
        })
    ]
})
export class AppModule {
    constructor(private upgrade: UpgradeModule) { }
    public ngDoBootstrap() {

      // Downgrades
      angular.module(moduleJs)
        .factory("dataService", downgradeInjectable(DataService))
        .factory("ngTranslateService", downgradeInjectable(TranslateService))
        .directive(
          getModal(EModals.Confimation),
          downgradeComponent({ component: ConfirmationDialogComponent }) as angular.IDirectiveFactory)
        .directive(getModal(EModals.Settings),
          downgradeComponent({ component: SettingsDialogComponent}) as angular.IDirectiveFactory)
        .directive("devicePanel", downgradeComponent({ component: DevicePanelComponent }));

      this.upgrade.bootstrap(document.body, [moduleJs], { strictDi: true });
    }
}
