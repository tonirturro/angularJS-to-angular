export const TooltipTemplate = ($uibTooltip: any) => {
    return $uibTooltip("uibTooltipTemplate", "tooltip", "mouseenter", {
        useContentExp: true
      });
};

TooltipTemplate.$inject = [ "$uibTooltip" ];
