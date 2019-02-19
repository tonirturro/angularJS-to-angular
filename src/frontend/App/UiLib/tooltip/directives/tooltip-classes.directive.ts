import { IPositionService } from "../../definitions";

export const TooltipClasses = ($uibPosition: IPositionService) => {
    return {
        link: (scope, element, attrs) => {
          // need to set the primary position so the
          // arrow has space during position measure.
          // tooltip.positionTooltip()
          if (scope.placement) {
            // // There are no top-left etc... classes
            // // in TWBS, so we need the primary position.
            const position = $uibPosition.parsePlacement(scope.placement);
            element.addClass(position[0]);
          }

          if (scope.popupClass) {
            element.addClass(scope.popupClass);
          }

          if (scope.animation) {
            element.addClass(attrs.tooltipAnimationClass);
          }
        },
        restrict: "A"
    };
};

TooltipClasses.$inject = [ "$uibPosition" ];
