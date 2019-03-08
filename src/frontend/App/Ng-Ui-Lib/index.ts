import { NgModule } from "@angular/core";
import { NgbTooltipWindowComponent } from "./tooltip/tooltip.component.ng2";
import { NgbTooltipDirective } from "./tooltip/tooltip.directive";

export { NgbTooltipConfig } from "./tooltip/tooltip-config.service";
export { NgbTooltipDirective } from "./tooltip/tooltip.directive";

@NgModule({
    declarations: [
        NgbTooltipDirective,
        NgbTooltipWindowComponent
    ],
    entryComponents: [ NgbTooltipWindowComponent ],
    exports: [ NgbTooltipDirective ]
})
export class UserInterfaceLibModule { }
