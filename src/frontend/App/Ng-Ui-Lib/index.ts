import { NgModule } from "@angular/core";
import { NgbModalBackdropComponent } from "./modal/modal-backdrop.component";
import { NgbModalWindowComponent } from "./modal/modal-window.component";
import { NgbModalService } from "./modal/modal.service";
import { NgbTooltipWindowComponent } from "./tooltip/tooltip.component.ng2";
import { NgbTooltipDirective } from "./tooltip/tooltip.directive";

export { NgbTooltipConfig } from "./tooltip/tooltip-config.service";
export { NgbTooltipDirective } from "./tooltip/tooltip.directive";

export { NgbModalService } from "./modal/modal.service";
export { NgbModalConfig, NgbModalOptions } from "./modal/modal-config";
export { NgbModalRef } from "./modal/modal-ref";
export { NgbActiveModal } from "./modal/modal-active";
export { ModalDismissReasons } from "./modal/modal-dismiss-reasons";

@NgModule({
    declarations: [
        NgbTooltipDirective,
        NgbTooltipWindowComponent,
        NgbModalWindowComponent,
        NgbModalBackdropComponent
    ],
    entryComponents: [
        NgbTooltipWindowComponent,
        NgbModalWindowComponent,
        NgbModalBackdropComponent
    ],
    exports: [ NgbTooltipDirective ],
    providers: [
        NgbModalService
    ]
})
export class UserInterfaceLibModule { }
