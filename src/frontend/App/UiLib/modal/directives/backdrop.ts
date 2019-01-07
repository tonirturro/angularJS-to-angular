import { IAttributes, IAugmentedJQuery } from "angular";
import { IModalStackService } from "../../definitions";

export const UibModalBackdrop = ($animate: angular.animate.IAnimateService, $modalStack: IModalStackService) => {
    const linkFn = (scope: any, element: IAugmentedJQuery, attrs: IAttributes) => {
        if (attrs.modalInClass) {
          $animate.addClass(element, attrs.modalInClass);
          scope.$on($modalStack.closingEvent, (e: any, setIsAsync: any) => {
            const done = setIsAsync();
            if (scope.modalOptions.animation) {
              $animate.removeClass(element, attrs.modalInClass).then(done);
            } else {
              done();
            }
          });
        }
      };
    return {
        compile: (tElement, tAttrs) => {
            tElement.addClass(tAttrs.backdropClass);
            return linkFn;
          },
        restrict: "A"
    };
};

UibModalBackdrop.$inject = [ "$animate", "$uibModalStack" ];
