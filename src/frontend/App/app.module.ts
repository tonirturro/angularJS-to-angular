import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { UpgradeModule } from "@angular/upgrade/static";
import { moduleJs } from "./app.modulejs";

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule
    ]
})
export class AppModule {
    constructor(private upgrade: UpgradeModule) { }
    public ngDoBootstrap() {
      this.upgrade.bootstrap(document.body, [moduleJs], { strictDi: true });
    }
}
