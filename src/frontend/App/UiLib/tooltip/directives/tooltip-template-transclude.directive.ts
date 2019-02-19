import { IAttributes, IAugmentedJQuery, ICompileService, ISCEService, IScope, ITemplateRequestService } from "angular";

export const TooltipTemplateTransclude = (
    $animate: angular.animate.IAnimateService,
    $sce: ISCEService,
    $compile: ICompileService,
    $templateRequest: ITemplateRequestService
) => {
    return {
        link(scope: any, elem: IAugmentedJQuery, attrs: IAttributes) {
          const origScope = scope.$eval(attrs.tooltipTemplateTranscludeScope);

          let changeCounter = 0;
          let currentScope: IScope;
          let previousElement: IAugmentedJQuery;
          let currentElement: IAugmentedJQuery;

          const cleanupLastIncludeContent = () => {
            if (previousElement) {
              previousElement.remove();
              previousElement = null;
            }

            if (currentScope) {
              currentScope.$destroy();
              currentScope = null;
            }

            if (currentElement) {
              $animate.leave(currentElement).then(() => {
                previousElement = null;
              });
              previousElement = currentElement;
              currentElement = null;
            }
          };

          scope.$watch($sce.parseAsResourceUrl(attrs.uibTooltipTemplateTransclude), (src) => {
            const thisChangeId = ++changeCounter;

            if (src) {
              // set the 2nd param to true to ignore the template request error so that the inner
              // contents and scope can be cleaned up.
              $templateRequest(src, true).then((response) => {
                if (thisChangeId !== changeCounter) { return; }
                const newScope = origScope.$new();
                const template = response;

                const clone = $compile(template)(newScope, (cloneParam) => {
                  cleanupLastIncludeContent();
                  $animate.enter(cloneParam, elem);
                });

                currentScope = newScope;
                currentElement = clone;

                currentScope.$emit("$includeContentLoaded", src);
              }, () => {
                if (thisChangeId === changeCounter) {
                  cleanupLastIncludeContent();
                  scope.$emit("$includeContentError", src);
                }
              });
              scope.$emit("$includeContentRequested", src);
            } else {
              cleanupLastIncludeContent();
            }
          });

          scope.$on("$destroy", cleanupLastIncludeContent);
        }
      };
};

TooltipTemplateTransclude.$inject = [ "$animate", "$sce", "$compile", "$templateRequest" ];
