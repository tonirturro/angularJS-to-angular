import { IAugmentedJQuery, ICompileService, IDocumentService, IPromise, IRootScopeService, IScope } from "angular";
import * as angular from "angular";
import {
    IModalInstanceService,
    IModalStackedMapKeyValuePair,
    IModalStackService,
    IMultiMap,
    IMultiMapFactory,
    IPositionService,
    IStackedMapFactory,
    IStakedMap
} from "../../definitions";

export class ModalStack implements IModalStackService {
    public static $inject = [
        "$q",
        "$animate",
        "$rootScope",
        "$compile",
        "$document",
        "$uibPosition",
        "$$multiMap",
        "$$stackedMap"];

    private readonly NOW_CLOSING_EVENT = "modal.stack.now-closing";
    private readonly OPENED_MODAL_CLASS = "modal-open";
    private readonly SNAKE_CASE_REGEXP = /[A-Z]/g;
    private readonly ARIA_HIDDEN_ATTRIBUTE_NAME = "data-bootstrap-modal-aria-hidden-count";
    // Modal focus behavior
    private readonly tabbableSelector = "a[href], area[href], input:not([disabled]):not([tabindex='-1']), " +
        "button:not([disabled]):not([tabindex='-1']),select:not([disabled]):not([tabindex='-1']), " +
        "textarea:not([disabled]):not([tabindex='-1']), " +
        "iframe, object, embed, *[tabindex]:not([tabindex='-1']), *[contenteditable=true]";

    private openedWindows: IStakedMap;
    private previousTopOpenedModal = null;
    private openedClasses: IMultiMap;
    private topModalIndex = 0;
    private backdropDomEl: IAugmentedJQuery;
    private backdropScope: any;
    private scrollbarPadding: any;

    public get closingEvent(): string {
        return this.NOW_CLOSING_EVENT;
    }

    constructor(
        private $q: angular.IQService,
        private $animate: angular.animate.IAnimateService,
        private $rootScope: IRootScopeService,
        private $compile: ICompileService,
        private $document: IDocumentService,
        private $uibPosition: IPositionService,
        private $$multiMap: IMultiMapFactory,
        private $$stackedMap: IStackedMapFactory) {
        this.openedWindows = this.$$stackedMap.createNew();
        this.openedClasses = this.$$multiMap.createNew();
        this.hookEvents();
    }

    public open(modalInstance: IModalInstanceService, modal: any) {
        const modalOpener = this.$document[0].activeElement;
        const modalBodyClass = modal.openedClass || this.OPENED_MODAL_CLASS;

        this.toggleTopWindowClass(false);

        // Store the current top first, to determine what index we ought to use
        // for the current top modal
        this.previousTopOpenedModal = this.openedWindows.top();

        this.openedWindows.add(modalInstance, {
            animation: modal.animation,
            appendTo: modal.appendTo,
            backdrop: modal.backdrop,
            closedDeferred: modal.closedDeferred,
            deferred: modal.deferred,
            keyboard: modal.keyboard,
            modalScope: modal.scope,
            openedClass: modal.openedClass,
            renderDeferred: modal.renderDeferred,
            windowTopClass: modal.windowTopClass
        });

        this.openedClasses.put(modalBodyClass, modalInstance);

        const appendToElement = modal.appendTo;
        const currBackdropIndex = this.backdropIndex;

        if (currBackdropIndex >= 0 && !this.backdropDomEl) {
            this.backdropScope = this.$rootScope.$new(true);
            this.backdropScope.modalOptions = modal;
            this.backdropScope.index = currBackdropIndex;
            this.backdropDomEl = angular.element('<div uib-modal-backdrop="modal-backdrop"></div>');
            this.backdropDomEl.attr({
                "class": "modal-backdrop",
                "modal-in-class": "in",
                "ng-style": "{'z-index': 1040 + (index && 1 || 0) + index*10}",
                "uib-modal-animation-class": "fade"
            });
            if (modal.backdropClass) {
                this.backdropDomEl.addClass(modal.backdropClass);
            }

            if (modal.animation) {
                this.backdropDomEl.attr("modal-animation", "true");
            }
            this.$compile(this.backdropDomEl)(this.backdropScope);
            this.$animate.enter(this.backdropDomEl, appendToElement);
            if (this.$uibPosition.isScrollable(appendToElement)) {
                this.scrollbarPadding = this.$uibPosition.scrollbarPadding(appendToElement);
                if (this.scrollbarPadding.heightOverflow && this.scrollbarPadding.scrollbarWidth) {
                    appendToElement.css({ paddingRight: this.scrollbarPadding.right + "px" });
                }
            }
        }

        let content;
        if (modal.component) {
            if (modal.downgradedComponent) {
                const componentName = this.snake_case(modal.component.name);
                const componentTemplate =
                    `<${componentName} ` +
                    `(close)="$close($value)" ` +
                    `(dismiss)="$dismiss($value)" ` +
                    `[modal-instance]="$uibModalInstance" ` +
                    `[resolve]="$resolve">` +
                    `</${componentName}>`;
                content = angular.element(componentTemplate);
            } else {
                content = document.createElement(this.snake_case(modal.component.name));
                content = angular.element(content);
                content.attr({
                    "close": "$close($value)",
                    "dismiss": "$dismiss($value)",
                    "modal-instance": "$uibModalInstance",
                    "resolve": "$resolve",
                });
            }
        } else {
            content = modal.content;
        }

        // Set the top modal index based on the index of the previous top modal
        this.topModalIndex = this.previousTopOpenedModal ?
            parseInt(this.previousTopOpenedModal.value.modalDomEl.attr("index"), 10) + 1 : 0;
        const angularDomEl = angular.element('<div uib-modal-window="modal-window"></div>');
        angularDomEl.attr({
            "animate": "animate",
            "aria-describedby": modal.ariaDescribedBy,
            "aria-labelledby": modal.ariaLabelledBy,
            "class": "modal",
            "index": this.topModalIndex,
            "modal-in-class": "in",
            "ng-style": "{'z-index': 1050 + $$topModalIndex*10, display: 'block'}",
            "role": "dialog",
            "size": modal.size,
            "tabindex": -1,
            "template-url": modal.windowTemplateUrl,
            "uib-modal-animation-class": "fade",
            "window-top-class": modal.windowTopClass,
        }).append(content);
        if (modal.windowClass) {
            angularDomEl.addClass(modal.windowClass);
        }

        if (modal.animation) {
            angularDomEl.attr("modal-animation", "true");
        }

        appendToElement.addClass(modalBodyClass);
        if (modal.scope) {
            // we need to explicitly add the modal index to the modal scope
            // because it is needed by ngStyle to compute the zIndex property.
            modal.scope.$$topModalIndex = this.topModalIndex;
        }
        this.$animate.enter(this.$compile(angularDomEl)(modal.scope), appendToElement);

        this.openedWindows.top().value.modalDomEl = angularDomEl;
        this.openedWindows.top().value.modalOpener = modalOpener;

        this.applyAriaHidden(angularDomEl);
    }

    public close(modalInstance: IModalInstanceService, result?: any): boolean {
        const modalWindow = this.openedWindows.get(modalInstance);
        this.unhideBackgroundElements();
        if (modalWindow && this.broadcastClosing(modalWindow, result, true)) {
            modalWindow.value.modalScope.$$uibDestructionScheduled = true;
            modalWindow.value.deferred.resolve(result);
            this.removeModalWindow(modalInstance, modalWindow.value.modalOpener);
            return true;
        }

        return !modalWindow;
    }

    public dismiss(modalInstance: IModalInstanceService, reason?: any): boolean {
        const modalWindow = this.openedWindows.get(modalInstance);
        this.unhideBackgroundElements();
        if (modalWindow && this.broadcastClosing(modalWindow, reason, false)) {
            modalWindow.value.modalScope.$$uibDestructionScheduled = true;
            modalWindow.value.deferred.reject(reason);
            this.removeModalWindow(modalInstance, modalWindow.value.modalOpener);
            return true;
        }
        return !modalWindow;
    }

    public dismissAll(reason?: any): void {
        let topModal = this.getTop();
        while (topModal && this.dismiss(topModal.key, reason)) {
            topModal = this.getTop();
        }
    }

    public getTop(): IModalStackedMapKeyValuePair {
        return this.openedWindows.top();
    }

    public modalRendered(modalInstance: IModalInstanceService) {
        const modalWindow = this.openedWindows.get(modalInstance);
        if (modalWindow) {
            modalWindow.value.renderDeferred.resolve();
        }
    }

    // Add or remove "windowTopClass" from the top window in the stack
    private toggleTopWindowClass(toggleSwitch) {
        if (this.openedWindows.length() > 0) {
            const modalWindow = this.openedWindows.top().value;
            modalWindow.modalDomEl.toggleClass(modalWindow.windowTopClass || "", toggleSwitch);
        }
    }

    private get backdropIndex(): number {
        let topBackdropIndex = -1;
        this.openedWindows.keys().forEach((opened, i) => {
            if (this.openedWindows.get(opened).value.backdrop) {
                topBackdropIndex = i;
            }
        });

        // If any backdrop exist, ensure that it's index is always
        // right below the top modal
        if (topBackdropIndex > -1 && topBackdropIndex < this.topModalIndex) {
            topBackdropIndex = this.topModalIndex;
        }
        return topBackdropIndex;
    }

    private snake_case(name: string): string {
        const separator = "-";
        return name.replace(this.SNAKE_CASE_REGEXP, (letter, pos) => {
            return (pos ? separator : "") + letter.toLowerCase();
        });
    }

    private applyAriaHidden(el: IAugmentedJQuery) {
        if (!el || el[0].tagName === "BODY") {
            return;
        }

        this.getSiblings(el).forEach((sibling) => {
            const elemIsAlreadyHidden = sibling.getAttribute("aria-hidden") === "true";
            let ariaHiddenCount = parseInt(sibling.getAttribute(this.ARIA_HIDDEN_ATTRIBUTE_NAME), 10);

            if (!ariaHiddenCount) {
                ariaHiddenCount = elemIsAlreadyHidden ? 1 : 0;
            }

            sibling.setAttribute(this.ARIA_HIDDEN_ATTRIBUTE_NAME, (ariaHiddenCount + 1).toString());
            sibling.setAttribute("aria-hidden", "true");
        });

        return this.applyAriaHidden(el.parent());
    }

    private getSiblings(el: IAugmentedJQuery): HTMLElement[] {
        const children = el.parent() ? el.parent().children() : [];

        return Array.prototype.filter.call(children, (child) => {
            return child !== el[0];
        });
    }

    private unhideBackgroundElements() {
        Array.prototype.forEach.call(
            document.querySelectorAll("[" + this.ARIA_HIDDEN_ATTRIBUTE_NAME + "]"),
            (hiddenEl) => {
                const ariaHiddenCount = parseInt(hiddenEl.getAttribute(this.ARIA_HIDDEN_ATTRIBUTE_NAME), 10);
                const newHiddenCount = ariaHiddenCount - 1;
                hiddenEl.setAttribute(this.ARIA_HIDDEN_ATTRIBUTE_NAME, newHiddenCount);

                if (!newHiddenCount) {
                    hiddenEl.removeAttribute(this.ARIA_HIDDEN_ATTRIBUTE_NAME);
                    hiddenEl.removeAttribute("aria-hidden");
                }
            }
        );
    }

    private broadcastClosing(modalWindow: any, resultOrReason: any, closing: boolean) {
        return !modalWindow.value.modalScope.$broadcast("modal.closing", resultOrReason, closing).defaultPrevented;
    }

    private removeModalWindow(modalInstance: IModalInstanceService, elementToReceiveFocus: HTMLElement) {
        const modalWindow = this.openedWindows.get(modalInstance).value;
        const appendToElement = modalWindow.appendTo;

        // clean up the stack
        this.openedWindows.remove(modalInstance);
        this.previousTopOpenedModal = this.openedWindows.top();
        if (this.previousTopOpenedModal) {
            this.topModalIndex = parseInt(this.previousTopOpenedModal.value.modalDomEl.attr("index"), 10);
        }

        this.removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, () => {
            const modalBodyClass = modalWindow.openedClass || this.OPENED_MODAL_CLASS;
            this.openedClasses.remove(modalBodyClass, modalInstance);
            const areAnyOpen = this.openedClasses.hasKey(modalBodyClass);
            appendToElement.toggleClass(modalBodyClass, areAnyOpen);
            if (!areAnyOpen &&
                this.scrollbarPadding &&
                this.scrollbarPadding.heightOverflow &&
                this.scrollbarPadding.scrollbarWidth) {
                if (this.scrollbarPadding.originalRight) {
                    appendToElement.css({ paddingRight: this.scrollbarPadding.originalRight + "px" });
                } else {
                    appendToElement.css({ paddingRight: "" });
                }
                this.scrollbarPadding = null;
            }
            this.toggleTopWindowClass(true);
        }, modalWindow.closedDeferred);
        this.checkRemoveBackdrop();

        // move focus to specified element if available, or else to body
        if (elementToReceiveFocus && elementToReceiveFocus.focus) {
            elementToReceiveFocus.focus();
        } else if (appendToElement.focus) {
            appendToElement.focus();
        }
    }

    private removeAfterAnimate(domEl: IAugmentedJQuery, scope: IScope, done: () => void, closedDeferred?: any) {
        let asyncDeferred;
        let asyncPromise = null;
        const setIsAsync = () => {
            const asyncDone = () => {
                asyncDeferred.resolve();
            };

            if (!asyncDeferred) {
                asyncDeferred = this.$q.defer();
                asyncPromise = asyncDeferred.promise;
            }

            return asyncDone;
        };
        scope.$broadcast(this.NOW_CLOSING_EVENT, setIsAsync);

        const afterAnimating: any = () => {
            if (afterAnimating.done) {
                return;
            }
            afterAnimating.done = true;

            this.$animate.leave(domEl).then(() => {
                if (done) {
                    done();
                }

                domEl.remove();
                if (closedDeferred) {
                    closedDeferred.resolve();
                }
            });

            scope.$destroy();
        };

        // Note that it's intentional that asyncPromise might be null.
        // That's when setIsAsync has not been called during the
        // NOW_CLOSING_EVENT broadcast.
        return this.$q.when(asyncPromise).then(afterAnimating);
    }

    private checkRemoveBackdrop() {
        // remove backdrop if no longer needed
        if (this.backdropDomEl && this.backdropIndex === -1) {
            let backdropScopeRef = this.backdropScope;
            this.removeAfterAnimate(this.backdropDomEl, this.backdropScope, () => {
                backdropScopeRef = null;
            });
            this.backdropDomEl = undefined;
            this.backdropScope = undefined;
        }
    }

    /**
     * Watch changes affecting the stack
     */
    private hookEvents(): any {
        this.$rootScope.$watch(() => this.backdropIndex, (newBackdropIndex) => {
            if (this.backdropScope) {
                this.backdropScope.index = newBackdropIndex;
            }
        });

        const onKeyDown = (evt: JQueryKeyEventObject) => { this.keydownListener(evt); };

        this.$document.on("keydown", onKeyDown);

        this.$rootScope.$on("$destroy", () => {
            this.$document.off("keydown", onKeyDown);
        });
    }

    /**
     * React on key down event to close or change focus element
     * @param evt the key event
     */
    private keydownListener(evt: JQueryKeyEventObject) {
        if (evt.isDefaultPrevented()) {
            return evt;
        }

        const modal = this.openedWindows.top();
        if (modal) {
            switch (evt.which) {
                case 27: {
                    if (modal.value.keyboard) {
                        evt.preventDefault();
                        this.$rootScope.$apply(() => {
                            this.dismiss(modal.key, "escape key press");
                        });
                    }
                    break;
                }
                case 9: {
                    const list = this.loadFocusElementList(modal);
                    let focusChanged = false;
                    if (evt.shiftKey) {
                        if (this.isFocusInFirstItem(evt, list) || this.isModalFocused(evt, modal)) {
                            focusChanged = this.focusLastFocusableElement(list);
                        }
                    } else {
                        if (this.isFocusInLastItem(evt, list)) {
                            focusChanged = this.focusFirstFocusableElement(list);
                        }
                    }

                    if (focusChanged) {
                        evt.preventDefault();
                        evt.stopPropagation();
                    }

                    break;
                }
            }
        }
    }

    private focusFirstFocusableElement(list: HTMLElement[]): boolean {
        if (list.length > 0) {
            list[0].focus();
            return true;
          }
        return false;
    }

    private isFocusInLastItem(evt: JQueryKeyEventObject, list: HTMLElement[]): boolean {
        if (list.length > 0) {
            return (evt.target || evt.srcElement) === list[list.length - 1];
        }
        return false;
    }

    private focusLastFocusableElement(list: HTMLElement[]): boolean {
        if (list.length > 0) {
            list[list.length - 1].focus();
            return true;
        }
        return false;
    }

    private isModalFocused(evt: JQueryKeyEventObject, modalWindow: any): boolean {
        if (evt && modalWindow) {
            const modalDomEl = modalWindow.value.modalDomEl;
            if (modalDomEl && modalDomEl.length) {
                return (evt.target || evt.srcElement) === modalDomEl[0];
            }
        }
        return false;
    }

    private isFocusInFirstItem(evt: JQueryKeyEventObject, list: HTMLElement[]): boolean {
        if (list.length > 0) {
            return (evt.target || evt.srcElement) === list[0];
        }
        return false;
    }

    private loadFocusElementList(modalWindow: any): any {
        if (modalWindow) {
            const modalDomE1 = modalWindow.value.modalDomEl;
            if (modalDomE1 && modalDomE1.length) {
                const elements = modalDomE1[0].querySelectorAll(this.tabbableSelector);
                return elements ?
                    Array.prototype.filter.call(elements, (element: HTMLElement) => {
                        return this.isVisible(element);
                    }) : elements;
            }
        }
    }

    private isVisible(element: HTMLElement) {
        return !!(
            element.offsetWidth ||
            element.offsetHeight ||
            element.getClientRects().length);
    }
}
