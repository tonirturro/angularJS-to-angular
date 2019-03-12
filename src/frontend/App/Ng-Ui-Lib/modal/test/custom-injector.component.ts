import { Component, OnDestroy } from "@angular/core";
import { CustomSpyService } from "./custom-spy.service";

@Component({selector: "custom-injector-cmpt", template: "Some content"})
export class CustomInjectorComponent implements OnDestroy {
  constructor(private spyService: CustomSpyService) {}

  public ngOnDestroy(): void { this.spyService.called = true; }
}
