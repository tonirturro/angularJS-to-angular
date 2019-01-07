import { IAugmentedJQuery, IDocumentService, IWindowService } from "angular";
import * as angular from "angular";
import { IPositionCoordinates, IPositionService, IViewPortOffset } from "../definitions";
import "./position.css";

export class Position implements IPositionService {

    public static $inject = ["$window", "$document"];

    private readonly PLACEMENT_REGEX = {
        auto: /\s?auto?\s?/i,
        primary: /^(top|bottom|left|right)$/,
        secondary: /^(top|bottom|left|right|center)$/,
        vertical: /^(top|bottom)$/
    };

    private readonly OVERFLOW_REGEX = {
        hidden: /(auto|scroll|hidden)/,
        normal: /(auto|scroll)/
    };

    private readonly BODY_REGEX = /(HTML|BODY)/;

    /**
     * Used by scrollbarWidth() function to cache scrollbar's width.
     * Do not access this variable directly, use scrollbarWidth() instead.
     */
    private SCROLLBAR_WIDTH: number;

    /**
     * scrollbar on body and html element in IE and Edge overlay
     * content and should be considered 0 width.
     */
    private BODY_SCROLLBAR_WIDTH: number;

    constructor(
        private $window: IWindowService,
        private $document: IDocumentService) { }

    /**
     * Provides coordinates for an element to be positioned relative to
     * another element.  Passing 'auto' as part of the placement parameter
     * will enable smart placement - where the element fits. i.e:
     * 'auto left-top' will check to see if there is enough space to the left
     * of the hostElem to fit the targetElem, if not place right (same for secondary
     * top placement).  Available space is calculated using the viewportOffset
     * function.
     *
     * @param {element} hostElem - The element to position against.
     * @param {element} targetElem - The element to position.
     * @param {string=} [placement=top] - The placement for the targetElem,
     *   default is 'top'. 'center' is assumed as secondary placement for
     *   'top', 'left', 'right', and 'bottom' placements.  Available placements are:
     *   <ul>
     *     <li>top</li>
     *     <li>top-right</li>
     *     <li>top-left</li>
     *     <li>bottom</li>
     *     <li>bottom-left</li>
     *     <li>bottom-right</li>
     *     <li>left</li>
     *     <li>left-top</li>
     *     <li>left-bottom</li>
     *     <li>right</li>
     *     <li>right-top</li>
     *     <li>right-bottom</li>
     *   </ul>
     * @param {boolean=} [appendToBody=false] - Should the top and left values returned
     *   be calculated from the body element, default is false.
     *
     * @returns {object} An object with the following properties:
     *   <ul>
     *     <li>**top**: Value for targetElem top.</li>
     *     <li>**left**: Value for targetElem left.</li>
     *     <li>**placement**: The resolved placement.</li>
     *   </ul>
     */
    public positionElements(
        angularHostElem: IAugmentedJQuery,
        angularTargetElem: IAugmentedJQuery,
        placement: string,
        appendToBody: boolean = false) {
        const hostElem = this.getRawNode(angularHostElem) as any;
        const targetElem = this.getRawNode(angularTargetElem) as any;

        // need to read from prop to support tests.
        const targetWidth =
            angular.isDefined(targetElem.offsetWidth) ? targetElem.offsetWidth : targetElem.prop("offsetWidth");
        const targetHeight =
            angular.isDefined(targetElem.offsetHeight) ? targetElem.offsetHeight : targetElem.prop("offsetHeight");

        const placements = this.parsePlacement(placement);

        const hostElemPos = appendToBody ? this.offset(hostElem) : this.position(hostElem);
        const targetElemPos = { top: 0, left: 0, placement: "" };

        if (placements[2]) {
            const viewportOffset = this.viewportOffset(hostElem, appendToBody);

            const targetElemStyle = this.$window.getComputedStyle(targetElem);
            const adjustedSize = {
                height:
                    targetHeight +
                    Math.round(Math.abs(this.parseStyle(targetElemStyle.marginTop) +
                        this.parseStyle(targetElemStyle.marginBottom))),
                width:
                    targetWidth +
                    Math.round(Math.abs(this.parseStyle(targetElemStyle.marginLeft) +
                        this.parseStyle(targetElemStyle.marginRight)))
            };

            placements[0] = placements[0] === "top" &&
                adjustedSize.height > viewportOffset.top && adjustedSize.height <= viewportOffset.bottom ?
                "bottom" :
                placements[0] === "bottom" &&
                    adjustedSize.height > viewportOffset.bottom && adjustedSize.height <= viewportOffset.top ?
                    "top" :
                    placements[0] === "left" &&
                        adjustedSize.width > viewportOffset.left &&
                        adjustedSize.width <= viewportOffset.right ?
                        "right" :
                        placements[0] === "right" &&
                            adjustedSize.width > viewportOffset.right &&
                            adjustedSize.width <= viewportOffset.left ?
                            "left" :
                            placements[0];

            placements[1] = placements[1] === "top" &&
                adjustedSize.height - hostElemPos.height > viewportOffset.bottom &&
                adjustedSize.height - hostElemPos.height <= viewportOffset.top ?
                "bottom" :
                placements[1] === "bottom" &&
                    adjustedSize.height - hostElemPos.height > viewportOffset.top &&
                    adjustedSize.height - hostElemPos.height <= viewportOffset.bottom ?
                    "top" :
                    placements[1] === "left" &&
                        adjustedSize.width - hostElemPos.width > viewportOffset.right &&
                        adjustedSize.width - hostElemPos.width <= viewportOffset.left ?
                        "right" :
                        placements[1] === "right" && adjustedSize.width - hostElemPos.width > viewportOffset.left &&
                            adjustedSize.width - hostElemPos.width <= viewportOffset.right ?
                            "left" :
                            placements[1];

            if (placements[1] === "center") {
                if (this.PLACEMENT_REGEX.vertical.test(placements[0])) {
                    const xOverflow = hostElemPos.width / 2 - targetWidth / 2;
                    if (viewportOffset.left + xOverflow < 0 &&
                        adjustedSize.width - hostElemPos.width <= viewportOffset.right) {
                        placements[1] = "left";
                    } else if (viewportOffset.right + xOverflow < 0 &&
                        adjustedSize.width - hostElemPos.width <= viewportOffset.left) {
                        placements[1] = "right";
                    }
                } else {
                    const yOverflow = hostElemPos.height / 2 - adjustedSize.height / 2;
                    if (viewportOffset.top + yOverflow < 0 &&
                        adjustedSize.height - hostElemPos.height <= viewportOffset.bottom) {
                        placements[1] = "top";
                    } else if (viewportOffset.bottom + yOverflow < 0 &&
                        adjustedSize.height - hostElemPos.height <= viewportOffset.top) {
                        placements[1] = "bottom";
                    }
                }
            }
        }

        switch (placements[0]) {
            case "top":
                targetElemPos.top = hostElemPos.top - targetHeight;
                break;
            case "bottom":
                targetElemPos.top = hostElemPos.top + hostElemPos.height;
                break;
            case "left":
                targetElemPos.left = hostElemPos.left - targetWidth;
                break;
            case "right":
                targetElemPos.left = hostElemPos.left + hostElemPos.width;
                break;
        }

        switch (placements[1]) {
            case "top":
                targetElemPos.top = hostElemPos.top;
                break;
            case "bottom":
                targetElemPos.top = hostElemPos.top + hostElemPos.height - targetHeight;
                break;
            case "left":
                targetElemPos.left = hostElemPos.left;
                break;
            case "right":
                targetElemPos.left = hostElemPos.left + hostElemPos.width - targetWidth;
                break;
            case "center":
                if (this.PLACEMENT_REGEX.vertical.test(placements[0])) {
                    targetElemPos.left = hostElemPos.left + hostElemPos.width / 2 - targetWidth / 2;
                } else {
                    targetElemPos.top = hostElemPos.top + hostElemPos.height / 2 - targetHeight / 2;
                }
                break;
        }

        targetElemPos.top = Math.round(targetElemPos.top);
        targetElemPos.left = Math.round(targetElemPos.left);
        targetElemPos.placement = placements[1] === "center" ? placements[0] : placements[0] + "-" + placements[1];

        return targetElemPos;
    }

    /**
     * Provides the closest scrollable ancestor.
     * A port of the jQuery UI scrollParent method:
     * https://github.com/jquery/jquery-ui/blob/master/ui/scroll-parent.js
     *
     * @param {element} elem - The element to find the scroll parent of.
     * @param {boolean=} [includeHidden=false] - Should scroll style of 'hidden' be considered,
     *   default is false.
     * @param {boolean=} [includeSelf=false] - Should the element being passed be
     * included in the scrollable llokup.
     *
     * @returns {element} A HTML element.
     */
    public scrollParent(
        innerEl: HTMLElement,
        includeHidden: boolean = false,
        includeSelf: boolean = false): HTMLElement {
        const elem: HTMLElement = this.getRawNode(innerEl);

        const overflowRegex = includeHidden ? this.OVERFLOW_REGEX.hidden : this.OVERFLOW_REGEX.normal;
        const documentEl = this.$document[0].documentElement;
        const elemStyle = this.$window.getComputedStyle(elem);
        if (includeSelf && overflowRegex.test(elemStyle.overflow + elemStyle.overflowY + elemStyle.overflowX)) {
            return elem;
        }
        let excludeStatic = elemStyle.position === "absolute";
        let scrollParent = elem.parentElement || documentEl;

        if (scrollParent === documentEl || elemStyle.position === "fixed") {
            return documentEl;
        }

        while (scrollParent.parentElement && scrollParent !== documentEl) {
            const spStyle = this.$window.getComputedStyle(scrollParent);
            if (excludeStatic && spStyle.position !== "static") {
                excludeStatic = false;
            }

            if (!excludeStatic && overflowRegex.test(spStyle.overflow + spStyle.overflowY + spStyle.overflowX)) {
                break;
            }
            scrollParent = scrollParent.parentElement;
        }

        return scrollParent;
    }

    /**
     * Checks to see if the element is scrollable.
     *
     * @param {element} element - The element to check.
     * @param {boolean=} [includeHidden=false] - Should scroll style of 'hidden' be considered,
     *   default is false.
     *
     * @returns {boolean} Whether the element is scrollable.
     */
    public isScrollable(element: IAugmentedJQuery, includeHidden: boolean = false): boolean {
        const elem = this.getRawNode(element) as HTMLElement;

        const overflowRegex = includeHidden ? this.OVERFLOW_REGEX.hidden : this.OVERFLOW_REGEX.normal;
        const elemStyle = this.$window.getComputedStyle(elem);
        return overflowRegex.test(elemStyle.overflow + elemStyle.overflowY + elemStyle.overflowX);
    }

    /**
     * Provides the padding required on an element to replace the scrollbar.
     *
     * @returns {object} An object with the following properties:
     *   <ul>
     *     <li>**scrollbarWidth**: the width of the scrollbar</li>
     *     <li>**widthOverflow**: whether the the width is overflowing</li>
     *     <li>**right**: the amount of right padding on the element needed to replace the scrollbar</li>
     *     <li>**rightOriginal**: the amount of right padding currently on the element</li>
     *     <li>**heightOverflow**: whether the the height is overflowing</li>
     *     <li>**bottom**: the amount of bottom padding on the element needed to replace the scrollbar</li>
     *     <li>**bottomOriginal**: the amount of bottom padding currently on the element</li>
     *   </ul>
     */
    public scrollbarPadding(element: any) {
        const elem = this.getRawNode(element);

        const elemStyle = this.$window.getComputedStyle(elem);
        const paddingRight = this.parseStyle(elemStyle.paddingRight);
        const paddingBottom = this.parseStyle(elemStyle.paddingBottom);
        const scrollParent = this.scrollParent(elem, false, true);
        const scrollbarWidth = this.scrollbarWidth(this.BODY_REGEX.test(scrollParent.tagName));

        return {
            bottom: paddingBottom + scrollbarWidth,
            heightOverflow: scrollParent.scrollHeight > scrollParent.clientHeight,
            originalBottom: paddingBottom,
            originalRight: paddingRight,
            right: paddingRight + scrollbarWidth,
            scrollbarWidth,
            widthOverflow: scrollParent.scrollWidth > scrollParent.clientWidth,
        };
    }

    /**
     * Provides offset distance to the closest scrollable ancestor
     * or viewport.  Accounts for border and scrollbar width.
     *
     * Right and bottom dimensions represent the distance to the
     * respective edge of the viewport element.  If the element
     * edge extends beyond the viewport, a negative value will be
     * reported.
     *
     * @param {element} elem - The element to get the viewport offset for.
     * @param {boolean=} [useDocument=false] - Should the viewport be the document element instead
     * of the first scrollable element, default is false.
     * @param {boolean=} [includePadding=true] - Should the padding on the offset parent element
     * be accounted for, default is true.
     *
     * @returns {IViewPortOffset} An object with the following properties:
     *   <ul>
     *     <li>**top**: distance to the top content edge of viewport element</li>
     *     <li>**bottom**: distance to the bottom content edge of viewport element</li>
     *     <li>**left**: distance to the left content edge of viewport element</li>
     *     <li>**right**: distance to the right content edge of viewport element</li>
     *   </ul>
     */
    public viewportOffset(
        element: HTMLElement,
        useDocument: boolean = false,
        includePadding: boolean = true): IViewPortOffset {
        const elem: HTMLElement = this.getRawNode(element);
        includePadding = includePadding !== false ? true : false;

        const elemBCR = elem.getBoundingClientRect();
        const offsetBCR = { top: 0, left: 0, bottom: 0, right: 0 };

        const offsetParent = useDocument ? this.$document[0].documentElement : this.scrollParent(elem);
        const offsetParentBCR = offsetParent.getBoundingClientRect();

        offsetBCR.top = offsetParentBCR.top + offsetParent.clientTop;
        offsetBCR.left = offsetParentBCR.left + offsetParent.clientLeft;
        if (offsetParent === this.$document[0].documentElement) {
            offsetBCR.top += this.$window.pageYOffset;
            offsetBCR.left += this.$window.pageXOffset;
        }
        offsetBCR.bottom = offsetBCR.top + offsetParent.clientHeight;
        offsetBCR.right = offsetBCR.left + offsetParent.clientWidth;

        if (includePadding) {
            const offsetParentStyle = this.$window.getComputedStyle(offsetParent);
            offsetBCR.top += this.parseStyle(offsetParentStyle.paddingTop);
            offsetBCR.bottom -= this.parseStyle(offsetParentStyle.paddingBottom);
            offsetBCR.left += this.parseStyle(offsetParentStyle.paddingLeft);
            offsetBCR.right -= this.parseStyle(offsetParentStyle.paddingRight);
        }

        return {
            bottom: Math.round(offsetBCR.bottom - elemBCR.bottom),
            left: Math.round(elemBCR.left - offsetBCR.left),
            right: Math.round(offsetBCR.right - elemBCR.right),
            top: Math.round(elemBCR.top - offsetBCR.top),
        };

    }

    /**
     * Provides a raw DOM element from a jQuery/jQLite element.
     *
     * @param {element} elem - The element to convert.
     *
     * @returns {element} A HTML element.
     */
    public getRawNode(angularEl: any): any {
        return angularEl.nodeName ? angularEl : angularEl[0] || angularEl;
    }

    /**
     * Provides read-only equivalent of jQuery's position function:
     * http://api.jquery.com/position/ - distance to closest positioned
     * ancestor.  Does not account for margins by default like jQuery position.
     *
     * @param {element} elem - The element to caclulate the position on.
     * @param {boolean=} [includeMargins=false] - Should margins be accounted
     * for, default is false.
     *
     * @returns {IPositionCoordinates} An object with the following properties:
     *   <ul>
     *     <li>**width**: the width of the element</li>
     *     <li>**height**: the height of the element</li>
     *     <li>**top**: distance to top edge of offset parent</li>
     *     <li>**left**: distance to left edge of offset parent</li>
     *   </ul>
     */
    public position(element: IAugmentedJQuery, includeMagins: boolean = false): IPositionCoordinates {
        const elem = this.getRawNode(element);

        const elemOffset = this.offset(elem);
        if (includeMagins) {
            const elemStyle = this.$window.getComputedStyle(elem);
            elemOffset.top -= this.parseStyle(elemStyle.marginTop);
            elemOffset.left -= this.parseStyle(elemStyle.marginLeft);
        }
        const parent = this.offsetParent(elem);
        let parentOffset = { top: 0, left: 0 } as IPositionCoordinates;

        if (parent !== this.$document[0].documentElement) {
            parentOffset = this.offset(parent);
            parentOffset.top += parent.clientTop - parent.scrollTop;
            parentOffset.left += parent.clientLeft - parent.scrollLeft;
        }

        return {
            height: Math.round(angular.isNumber(elemOffset.height) ? elemOffset.height : elem.offsetHeight),
            left: Math.round(elemOffset.left - parentOffset.left),
            top: Math.round(elemOffset.top - parentOffset.top),
            width: Math.round(angular.isNumber(elemOffset.width) ? elemOffset.width : elem.offsetWidth)
        };
    }

    /**
     * Provides read-only equivalent of jQuery's offset function:
     * http://api.jquery.com/offset/ - distance to viewport.  Does
     * not account for borders, margins, or padding on the body
     * element.
     *
     * @param {element} elem - The element to calculate the offset on.
     *
     * @returns {IPositionCoordinates} An object with the following properties:
     *   <ul>
     *     <li>**width**: the width of the element</li>
     *     <li>**height**: the height of the element</li>
     *     <li>**top**: distance to top edge of viewport</li>
     *     <li>**right**: distance to bottom edge of viewport</li>
     *   </ul>
     */
    public offset(element: any): IPositionCoordinates {
        const elem = this.getRawNode(element);

        const elemBCR = elem.getBoundingClientRect();
        return {
            height: Math.round(angular.isNumber(elemBCR.height) ? elemBCR.height : elem.offsetHeight),
            left: Math.round(elemBCR.left + (this.$window.pageXOffset || this.$document[0].documentElement.scrollLeft)),
            top: Math.round(elemBCR.top + (this.$window.pageYOffset || this.$document[0].documentElement.scrollTop)),
            width: Math.round(angular.isNumber(elemBCR.width) ? elemBCR.width : elem.offsetWidth)
        };
    }

    /**
     * Provides an array of placement values parsed from a placement string.
     * Along with the 'auto' indicator, supported placement strings are:
     *   <ul>
     *     <li>top: element on top, horizontally centered on host element.</li>
     *     <li>top-left: element on top, left edge aligned with host element left edge.</li>
     *     <li>top-right: element on top, lerightft edge aligned with host element right edge.</li>
     *     <li>bottom: element on bottom, horizontally centered on host element.</li>
     *     <li>bottom-left: element on bottom, left edge aligned with host element left edge.</li>
     *     <li>bottom-right: element on bottom, right edge aligned with host element right edge.</li>
     *     <li>left: element on left, vertically centered on host element.</li>
     *     <li>left-top: element on left, top edge aligned with host element top edge.</li>
     *     <li>left-bottom: element on left, bottom edge aligned with host element bottom edge.</li>
     *     <li>right: element on right, vertically centered on host element.</li>
     *     <li>right-top: element on right, top edge aligned with host element top edge.</li>
     *     <li>right-bottom: element on right, bottom edge aligned with host element bottom edge.</li>
     *   </ul>
     * A placement string with an 'auto' indicator is expected to be
     * space separated from the placement, i.e: 'auto bottom-left'  If
     * the primary and secondary placement values do not match 'top,
     * bottom, left, right' then 'top' will be the primary placement and
     * 'center' will be the secondary placement.  If 'auto' is passed, true
     * will be returned as the 3rd value of the array.
     *
     * @param {string} placement - The placement string to parse.
     *
     * @returns {array} An array with the following values
     * <ul>
     *   <li>**[0]**: The primary placement.</li>
     *   <li>**[1]**: The secondary placement.</li>
     *   <li>**[2]**: If auto is passed: true, else undefined.</li>
     * </ul>
     */
    private parsePlacement(placement: string): any[] {
        const autoPlace = this.PLACEMENT_REGEX.auto.test(placement);
        if (autoPlace) {
            placement = placement.replace(this.PLACEMENT_REGEX.auto, "");
        }

        const placements: any[] = placement.split("-");

        placements[0] = placements[0] || "top";
        if (!this.PLACEMENT_REGEX.primary.test(placements[0])) {
            placements[0] = "top";
        }

        placements[1] = placements[1] || "center";
        if (!this.PLACEMENT_REGEX.secondary.test(placements[1])) {
            placements[1] = "center";
        }

        if (autoPlace) {
            placements[2] = true;
        } else {
            placements[2] = false;
        }

        return placements;
    }

    /**
     * Provides a parsed number for a style property.  Strips
     * units and casts invalid numbers to 0.
     *
     * @param {string} value - The style value to parse.
     *
     * @returns {number} A valid number.
     */
    private parseStyle(value: string): number {
        const valueNumber = parseFloat(value);
        return isFinite(valueNumber) ? valueNumber : 0;
    }

    /**
     * Provides the closest positioned ancestor.
     *
     * @param {element} element - The element to get the offest parent for.
     *
     * @returns {element} The closest positioned ancestor.
     */
    private offsetParent(element: HTMLElement): HTMLElement {
        const elem = this.getRawNode(element);

        let offsetParent = elem.offsetParent || this.$document[0].documentElement;

        while (offsetParent &&
            offsetParent !== this.$document[0].documentElement &&
            this.isStaticPositioned(offsetParent)) {
            offsetParent = offsetParent.offsetParent;
        }

        return offsetParent || this.$document[0].documentElement;
    }

    private isStaticPositioned(el: HTMLElement) {
        return (this.$window.getComputedStyle(el).position || "static") === "static";
    }

    /**
     * Provides the scrollbar width, concept from TWBS measureScrollbar()
     * function in https://github.com/twbs/bootstrap/blob/master/js/modal.js
     * In IE and Edge, scollbar on body and html element overlay and should
     * return a width of 0.
     *
     * @returns {number} The width of the browser scollbar.
     */
    private scrollbarWidth(isBody: boolean) {
    if (isBody) {
        if (angular.isUndefined(this.BODY_SCROLLBAR_WIDTH)) {
            const bodyElem = this.$document.find("body");
            bodyElem.addClass("uib-position-body-scrollbar-measure");
            this.BODY_SCROLLBAR_WIDTH = this.$window.innerWidth - bodyElem[0].clientWidth;
            this.BODY_SCROLLBAR_WIDTH = isFinite(this.BODY_SCROLLBAR_WIDTH) ? this.BODY_SCROLLBAR_WIDTH : 0;
            bodyElem.removeClass("uib-position-body-scrollbar-measure");
        }
        return this.BODY_SCROLLBAR_WIDTH;
    }

    if (angular.isUndefined(this.SCROLLBAR_WIDTH)) {
        const scrollElem = angular.element('<div class="uib-position-scrollbar-measure"></div>');
        this.$document.find("body").append(scrollElem);
        this.SCROLLBAR_WIDTH = scrollElem[0].offsetWidth - scrollElem[0].clientWidth;
        this.SCROLLBAR_WIDTH = isFinite(this.SCROLLBAR_WIDTH) ? this.SCROLLBAR_WIDTH : 0;
        scrollElem.remove();
    }

    return this.SCROLLBAR_WIDTH;
}
}
