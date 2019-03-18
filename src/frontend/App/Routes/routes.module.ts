import { APP_BASE_HREF } from "@angular/common";
import { NgModule } from "@angular/core";
import { UIRouterModule } from "@uirouter/angular";
import { STATES } from "./routes";

@NgModule({
    imports: [
        UIRouterModule.forRoot({
            states: STATES,
            useHash: true
        })
    ],
    providers: [
        {
            provide: APP_BASE_HREF,
            useValue : "./"
        }
    ],
})
export class RoutesModule { }
