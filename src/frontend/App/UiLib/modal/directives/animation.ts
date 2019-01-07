import { IAttributes, IAugmentedJQuery } from "angular";

export const UibModalAnimationClass = () => {
    return {
      compile: (tElement: IAugmentedJQuery, tAttrs: IAttributes) => {
        if (tAttrs.modalAnimation) {
          tElement.addClass(tAttrs.uibModalAnimationClass);
        }
      }
    };
};
