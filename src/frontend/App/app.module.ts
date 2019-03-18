import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { UpgradeModule } from "@angular/upgrade/static";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";

import { moduleJs } from "./app.modulejs";

import { ComponentsModule } from "./Ng-Components";

import { MainPageComponent } from "./Ng-Components/main-page.component.ng2";
import { RoutesModule } from "./Routes/routes.module";
import { GettextTranslationsLoader } from "./Services/gettext-translations.loader";

// AoT requires an exported function for factories
export function GettextLoaderLoaderFactory(http: HttpClient) {
  return new GettextTranslationsLoader(http);
}

@NgModule({
    bootstrap: [ MainPageComponent ],
    imports: [
        BrowserModule,
        UpgradeModule,
        HttpClientModule,
        ComponentsModule,
        RoutesModule,
        TranslateModule.forRoot({
          loader: {
            deps: [ HttpClient ],
            provide: TranslateLoader,
            useFactory: GettextLoaderLoaderFactory
          }
        })
    ]
})
export class AppModule {
    constructor(private upgrade: UpgradeModule) { }
    public ngDoBootstrap() {
      this.upgrade.bootstrap(document.body, [moduleJs], { strictDi: true });
    }
}
