  import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    Renderer2,
    ViewEncapsulation
  } from "@angular/core";
  import {Placement} from "../util/positioning";

  @Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        "[class]": `"tooltip show bs-tooltip-" ` +
                   `+ placement.split("-")[0]+" bs-tooltip-" + placement + (tooltipClass ? " " + tooltipClass : "")`,
        "[id]": "id",
        "role": "tooltip",
      },
    selector: "ngb-tooltip-window",
    styleUrls: [ "./tooltip.component.scss" ],
    templateUrl: "./tooltip.component.html"
  })

  export class NgbTooltipWindowComponent {
    @Input() public placement: Placement = "top";
    @Input() public id: string;
    @Input() public tooltipClass: string;

    constructor(private element: ElementRef<HTMLElement>, private renderer: Renderer2) {}

    public applyPlacement(placement: Placement) {
      // remove the current placement classes
      this.renderer.removeClass(this.element.nativeElement, "bs-tooltip-" + this.placement.toString().split("-")[0]);
      this.renderer.removeClass(this.element.nativeElement, "bs-tooltip-" + this.placement.toString());

      // set the new placement classes
      this.placement = placement;

      // apply the new placement
      this.renderer.addClass(this.element.nativeElement, "bs-tooltip-" + this.placement.toString().split("-")[0]);
      this.renderer.addClass(this.element.nativeElement, "bs-tooltip-" + this.placement.toString());
    }
  }
