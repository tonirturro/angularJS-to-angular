import { IAugmentedJQuery, IDirective, IScope, ITranscludeFunction } from "angular";

// .directive('uibModalTransclude', ['$animate',
export const UibModalTransclude = ($animate: angular.animate.IAnimateService) => {
    return {
      link: (
          scope: IScope,
          element: IAugmentedJQuery,
          attrs: IArguments,
          controller: any,
          transclude: ITranscludeFunction) => {
        transclude(scope.$parent, (clone) => {
          element.empty();
          $animate.enter(clone, element);
        });
      }
    } as IDirective;
};

UibModalTransclude.$inject = [ "$animate" ];
