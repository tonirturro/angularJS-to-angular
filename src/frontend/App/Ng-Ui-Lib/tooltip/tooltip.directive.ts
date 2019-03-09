import { DOCUMENT } from "@angular/common";
import {
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    ElementRef,
    EventEmitter,
    Inject,
    Injector,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    TemplateRef,
    ViewContainerRef } from "@angular/core";
import { AutoClose } from "../util/autoclose.service";
import { PopupService } from "../util/popup";
import { PlacementArray, positionElements } from "../util/positioning";
import { listenToTriggers } from "../util/triggers";
import { NgbTooltipConfig } from "./tooltip-config.service";
import { NgbTooltipWindowComponent } from "./tooltip.component.ng2";

/**
 * A lightweight, extensible directive for fancy tooltip creation.
 */
@Directive({selector: "[ngbTooltip]", exportAs: "ngbTooltip"})

  export class NgbTooltipDirective implements OnInit, OnDestroy {

    public static nextId: number = 0;

    /**
     * Indicates whether the tooltip should be closed on Escape key and inside/outside clicks.
     *
     * - true (default): closes on both outside and inside clicks as well as Escape presses
     * - false: disables the autoClose feature (NB: triggers still apply)
     * - 'inside': closes on inside clicks as well as Escape presses
     * - 'outside': closes on outside clicks (sometimes also achievable through triggers)
     * as well as Escape presses
     *
     * @since 3.0.0
     */
    @Input() public autoClose: boolean | "inside" | "outside";
    /**
     * Placement of a tooltip accepts:
     *    "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right",
     *    "left", "left-top", "left-bottom", "right", "right-top", "right-bottom"
     * and array of above values.
     */
    @Input() public placement: PlacementArray;
    /**
     * Specifies events that should trigger. Supports a space separated list of event names.
     */
    @Input() public triggers: string;
    /**
     * A selector specifying the element the tooltip should be appended to.
     * Currently only supports "body".
     */
    @Input() public container: string;
    /**
     * A flag indicating if a given tooltip is disabled and should not be displayed.
     *
     * @since 1.1.0
     */
    @Input() public disableTooltip: boolean;
    /**
     * An optional class applied to ngb-tooltip-window
     *
     * @since 3.2.0
     */
    @Input() public tooltipClass: string;
    /**
     * Emits an event when the tooltip is shown
     */
    @Output() public shown = new EventEmitter();
    /**
     * Emits an event when the tooltip is hidden
     */
    @Output() public hidden = new EventEmitter();

    private ngbTooltipValue: string | TemplateRef<any>;
    private ngbTooltipWindowId = `ngb-tooltip-${NgbTooltipDirective.nextId++}`;
    private popupService: PopupService<NgbTooltipWindowComponent>;
    private windowRef: ComponentRef<NgbTooltipWindowComponent>;
    private unregisterListenersFn;
    private zoneSubscription: any;

    constructor(
        private elementRef: ElementRef<HTMLElement>,
        private renderer: Renderer2,
        injector: Injector,
        componentFactoryResolver: ComponentFactoryResolver,
        viewContainerRef: ViewContainerRef, config: NgbTooltipConfig,
        private ngZone: NgZone,
        @Inject(DOCUMENT) private document: any,
        private autoCloseService: AutoClose,
        private changeDetector: ChangeDetectorRef) {
      this.autoClose = config.autoClose;
      this.placement = config.placement;
      this.triggers = config.triggers;
      this.container = config.container;
      this.disableTooltip = config.disableTooltip;
      this.tooltipClass = config.tooltipClass;
      this.popupService = new PopupService<NgbTooltipWindowComponent>(
          NgbTooltipWindowComponent, injector, viewContainerRef, renderer, componentFactoryResolver);

      this.zoneSubscription = this.ngZone.onStable.subscribe(() => {
        if (this.windowRef) {
          this.windowRef.instance.applyPlacement(
              positionElements(
                  this.elementRef.nativeElement, this.windowRef.location.nativeElement, this.placement,
                  this.container === "body"));
        }
      });
    }

    /**
     * Content to be displayed as tooltip. If falsy, the tooltip won't open.
     */
    @Input()
    set ngbTooltip(value: string | TemplateRef<any>) {
      this.ngbTooltipValue = value;
      if (!value && this.windowRef) {
        this.close();
      }
    }

    get ngbTooltip() { return this.ngbTooltipValue; }

    /**
     * Opens an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     * The context is an optional value to be injected into the tooltip template when it is created.
     */
    public open(context?: any) {
      if (!this.windowRef && this.ngbTooltipValue && !this.disableTooltip) {
        this.windowRef = this.popupService.open(this.ngbTooltipValue, context);
        this.windowRef.instance.tooltipClass = this.tooltipClass;
        this.windowRef.instance.id = this.ngbTooltipWindowId;

        this.renderer.setAttribute(this.elementRef.nativeElement, "aria-describedby", this.ngbTooltipWindowId);

        if (this.container === "body") {
          this.document.querySelector(this.container).appendChild(this.windowRef.location.nativeElement);
        }

        this.windowRef.instance.placement = Array.isArray(this.placement) ? this.placement[0] : this.placement;

        // apply styling to set basic css-classes on target element, before going for positioning
        this.windowRef.changeDetectorRef.detectChanges();
        this.windowRef.changeDetectorRef.markForCheck();

        // position tooltip along the element
        this.windowRef.instance.applyPlacement(
            positionElements(
                this.elementRef.nativeElement, this.windowRef.location.nativeElement, this.placement,
                this.container === "body"));

        this.autoCloseService.install(
            this.autoClose, () => this.close(), this.hidden, [this.windowRef.location.nativeElement]);

        this.shown.emit();
      }
    }

    /**
     * Closes an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     */
    public close(): void {
      if (this.windowRef != null) {
        this.renderer.removeAttribute(this.elementRef.nativeElement, "aria-describedby");
        this.popupService.close();
        this.windowRef = null;
        this.hidden.emit();
        this.changeDetector.markForCheck();
      }
    }

    /**
     * Toggles an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     */
    public toggle(): void {
      if (this.windowRef) {
        this.close();
      } else {
        this.open();
      }
    }

    /**
     * Returns whether or not the tooltip is currently being shown
     */
    public isOpen(): boolean { return this.windowRef != null; }

    public ngOnInit() {
      this.unregisterListenersFn = listenToTriggers(
          this.renderer, this.elementRef.nativeElement, this.triggers, this.open.bind(this), this.close.bind(this),
          this.toggle.bind(this));
    }

    public ngOnDestroy() {
      this.close();
      // This check is needed as it might happen that ngOnDestroy is called before ngOnInit
      // under certain conditions, see: https://github.com/ng-bootstrap/ng-bootstrap/issues/2199
      if (this.unregisterListenersFn) {
        this.unregisterListenersFn();
      }
      this.zoneSubscription.unsubscribe();
    }
  }
