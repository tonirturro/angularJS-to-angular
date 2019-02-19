export const TooltipTemplatePopup = () => {
    return {
        restrict: "A",
        scope: { contentExp: "&", originScope: "&" },
        templateUrl: "uib/template/tooltip/tooltip-template-popup.html"
      };
};
