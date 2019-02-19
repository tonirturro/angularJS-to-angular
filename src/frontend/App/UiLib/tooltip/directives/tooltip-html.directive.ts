export const TooltipHtml = ($uibTooltip: any) => {
    return $uibTooltip("uibTooltipHtml", "tooltip", "mouseenter", {
        useContentExp: true
      });
};

TooltipHtml.$inject = [ "$uibTooltip" ];
