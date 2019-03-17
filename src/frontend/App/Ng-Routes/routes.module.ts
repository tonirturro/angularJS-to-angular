import { APP_BASE_HREF } from "@angular/common";
import { NgModule } from "@angular/core";
import { UIRouterModule } from "@uirouter/angular";
import { STATES } from "./routes";
import { StateWrapperService } from "./state-wrapper.service";
import { ViewWrapperComponent } from "./view-wrapper.component";

@NgModule({
    declarations: [
        ViewWrapperComponent
    ],
    entryComponents: [
        ViewWrapperComponent
    ],
    imports: [
        UIRouterModule.forRoot({
            states: STATES
        })
    ],
    providers: [
        StateWrapperService,
        {
            provide: APP_BASE_HREF,
            useValue : "/"
        }
    ],
})
export class RoutesModule { }
