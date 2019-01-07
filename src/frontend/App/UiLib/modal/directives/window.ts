import { IAttributes, IAugmentedJQuery, IDocumentService, IQService, } from "angular";
import { IModalStackService } from "../../definitions";

export const UibModalWindow = (
    $modalStack: IModalStackService,
    $q: IQService,
    $animateCss: angular.animate.IAnimateCssService,
    $document: IDocumentService) => {
    return {
        link: (scope: any, element: any, attrs: IAttributes) => {
            element.addClass(attrs.windowTopClass || "");
            scope.size = attrs.size;

            scope.close = (evt: any) => {
                const modal = $modalStack.getTop();
                if (modal &&
                    modal.value.backdrop &&
                    modal.value.backdrop !== "static" &&
                    evt.target === evt.currentTarget) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    $modalStack.dismiss(modal.key, "backdrop click");
                }
            };

            // moved from template to fix issue #2280
            element.on("click", scope.close);

            // This property is only added to the scope for the purpose of detecting when this directive is rendered.
            // We can detect that by using this property in the template associated with this directive and then use
            // {@link Attribute#$observe} on it. For more details please see {@link TableColumnResize}.
            scope.$isRendered = true;

            // Deferred object that will be resolved when this modal is rendered.
            const modalRenderDeferObj = $q.defer();
            // Resolve render promise post-digest
            scope.$$postDigest(() => {
                modalRenderDeferObj.resolve();
            });

            modalRenderDeferObj.promise.then(() => {
                let animationPromise = null;

                if (attrs.modalInClass) {
                    animationPromise = $animateCss(element, {
                        addClass: attrs.modalInClass
                    }).start();

                    scope.$on($modalStack.closingEvent, (e: any, setIsAsync: any) => {
                        const done = setIsAsync() as () => void;
                        const animationRunner = $animateCss(element, {
                            removeClass: attrs.modalInClass
                        });
                        animationRunner.start().then(() => {
                            done();
                        });
                    });
                }

                $q.when(animationPromise).then(() => {
                    // Notify {@link $modalStack} that modal is rendered.
                    const modal = $modalStack.getTop();
                    if (modal) {
                        $modalStack.modalRendered(modal.key);
                    }

                    /**
                     * If something within the freshly-opened modal already has focus (perhaps via a
                     * directive that causes focus) then there's no need to try to focus anything.
                     */
                    if (!($document[0].activeElement && element[0].contains($document[0].activeElement))) {
                        const inputWithAutofocus = element[0].querySelector("[autofocus]");
                        /**
                         * Auto-focusing of a freshly-opened modal element causes any child elements
                         * with the autofocus attribute to lose focus. This is an issue on touch
                         * based devices which will show and then hide the onscreen keyboard.
                         * Attempts to refocus the autofocus element via JavaScript will not reopen
                         * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
                         * the modal element if the modal does not contain an autofocus element.
                         */
                        if (inputWithAutofocus) {
                            inputWithAutofocus.focus();
                        } else {
                            element[0].focus();
                        }
                    }
                });
            });
        },
        restrict: "A",
        scope: {
            index: "@"
        },
        templateUrl: (tElement: IAugmentedJQuery, tAttrs: IAttributes) => {
            return tAttrs.templateUrl || "uib/template/modal/window.html";
        },
        transclude: true,
    };
};

UibModalWindow.$inject = [ "$uibModalStack", "$q", "$animateCss", "$document" ];
