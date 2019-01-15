import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";

import { Data } from "./data.service";

@NgModule({
    imports: [ HttpClientModule ],
    providers: [ Data ]
})
export class AppServicesModule {}
