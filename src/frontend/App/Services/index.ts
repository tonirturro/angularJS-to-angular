import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";

import { DataService } from "./data.service";

@NgModule({
    imports: [ HttpClientModule ],
    providers: [ DataService ]
})
export class AppServicesModule {}
