import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { UserInterfaceLibModule } from "../..";
import { CustomInjectorComponent } from "./custom-injector.component";
import { DestroyableComponent } from "./destroyable.component";
import { SpyService } from "./spy.service";
import { TestA11yComponent } from "./test-a11y.component.ng2";
import { TestComponent } from "./test.component.ng2";
import { WithActiveModalComponent } from "./with-active-modal.component.ng2";
import { WithAutofocusModalComponent } from "./with-autofocus-modal.component";
import { WithFirstFocusableModalComponent } from "./with-first-focusable-modal.component.ng2";
import { WithSkipTabindexFirstFocusableModalComponent } from "./with-skip-tableindex-first-focusable-modal.component.ng2";

@NgModule({
    declarations: [
      TestComponent,
      CustomInjectorComponent,
      DestroyableComponent,
      WithActiveModalComponent,
      WithAutofocusModalComponent,
      WithFirstFocusableModalComponent,
      WithSkipTabindexFirstFocusableModalComponent,
      TestA11yComponent
    ],
    entryComponents: [
        CustomInjectorComponent,
        DestroyableComponent,
        WithActiveModalComponent,
        WithAutofocusModalComponent,
        WithFirstFocusableModalComponent,
        WithSkipTabindexFirstFocusableModalComponent
    ],
    exports: [TestComponent, DestroyableComponent],
    imports: [CommonModule, UserInterfaceLibModule],
    providers: [SpyService]
  })
export class NgbModalTestModule {}
