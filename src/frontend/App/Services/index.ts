import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";

import { ApplicationService } from "./application.service";
import { DataService } from "./data.service";
import { LogService } from "./log.service";

@NgModule({
    imports: [
        HttpClientModule,
     ],
    providers: [
        ApplicationService,
        DataService,
        LogService
    ]
})
export class AppServicesModule {}
