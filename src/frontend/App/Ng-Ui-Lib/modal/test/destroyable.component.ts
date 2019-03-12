import { Component, OnDestroy } from "@angular/core";

import { SpyService } from "./spy.service";

@Component({selector: "destroyable-cmpt", template: "Some content"})
export class DestroyableComponent implements OnDestroy {
  constructor(private spyService: SpyService) {}

  public ngOnDestroy(): void { this.spyService.called = true; }
}
