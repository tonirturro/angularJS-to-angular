import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { downgradeComponent, downgradeInjectable, UpgradeModule } from "@angular/upgrade/static";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";

import * as angular from "angular";
import { moduleJs } from "./app.modulejs";

import {
  ComponentsModule,
  DeviceEditComponent,
  DevicePanelComponent,
  LocalizationService,
  PageGridComponent,
  ToolBarComponent} from "./Ng-Components";
import { ModalManagerService } from "./Ng-Ui-Lib";
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
        .factory("ngTranslateService", downgradeInjectable(LocalizationService))
        .factory("modalManager", downgradeInjectable(ModalManagerService))
        .directive("devicePanel", downgradeComponent({ component: DevicePanelComponent }))
        .directive("deviceEdit", downgradeComponent({component: DeviceEditComponent }))
        .directive("toolbar", downgradeComponent({ component: ToolBarComponent }))
        .directive("pageGrid", downgradeComponent({ component: PageGridComponent }));

      this.upgrade.bootstrap(document.body, [moduleJs], { strictDi: true });
    }
}
