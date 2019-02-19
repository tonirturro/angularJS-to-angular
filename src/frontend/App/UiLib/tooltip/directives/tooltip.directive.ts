export const Tooltip = ($uibTooltip: any) => {
    return $uibTooltip("uibTooltip", "tooltip", "mouseenter");
};

Tooltip.$inject = [ "$uibTooltip" ];
