import { ComponentFactoryResolver, Injectable, Injector } from "@angular/core";

import { IModalSettings, NgbModalConfig } from "./modal-config";
import { NgbModalRef } from "./modal-ref";
import { NgbModalStackService } from "./modal-stack.service";

/**
 * A service to open modal windows. Creating a modal is straightforward: create a template and pass it as an argument to
 * the "open" method!
 */
@Injectable({providedIn: "root"})
export class NgbModalService {
  constructor(
      private moduleCFR: ComponentFactoryResolver,
      private injector: Injector,
      private modalStack: NgbModalStackService,
      private config: NgbModalConfig) {}

  /**
   * Opens a new modal window with the specified content and using supplied options. Content can be provided
   * as a TemplateRef or a component type. If you pass a component type as content, then instances of those
   * components can be injected with an instance of the NgbActiveModal class. You can use methods on the
   * NgbActiveModal class to close / dismiss modals from "inside" of a component.
   */
  public open(content: any, options: IModalSettings = {}): NgbModalRef {
    const combinedOptions = Object.assign({}, this.config, options);
    return this.modalStack.open(this.moduleCFR, this.injector, content, combinedOptions);
  }

  /**
   * Dismiss all currently displayed modal windows with the supplied reason.
   *
   * @since 3.1.0
   */
  public dismissAll(reason?: any) { this.modalStack.dismissAll(reason); }

  /**
   * Indicates if there are currently any open modal windows in the application.
   *
   * @since 3.3.0
   */
  public hasOpenModals(): boolean { return this.modalStack.hasOpenModals(); }
}
