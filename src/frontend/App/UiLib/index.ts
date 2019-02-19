import * as angular from "angular";
import { IServiceProviderFactory, ITemplateCacheService } from "angular";
import { UibModalAnimationClass } from "./modal/directives/animation";
import { UibModalBackdrop } from "./modal/directives/backdrop";
import { UibModalTransclude } from "./modal/directives/transclude";
import { UibModalWindow } from "./modal/directives/window";
import { UiLibModal } from "./modal/services/modal";
import { ModalManager } from "./modal/services/modal-manager.service";
import { ModalStack } from "./modal/services/modalStack";
import { Resolver } from "./modal/services/resolver";
import { MultiMapFactory } from "./multiMap/multiMapFactory";
import { Position } from "./position/position";
import { StackedMapFactory } from "./stackedMap/stakedMapFactory";
import { TooltipClasses } from "./tooltip/directives/tooltip-classes.directive";
import { TooltipHtmlPopup } from "./tooltip/directives/tooltip-html-popup.directive";
import { TooltipHtml } from "./tooltip/directives/tooltip-html.directive";
import { TooltipPopup } from "./tooltip/directives/tooltip-popup.directive";
import { TooltipTemplatePopup } from "./tooltip/directives/tooltip-template-popup.directive";
import { TooltipTemplateTransclude } from "./tooltip/directives/tooltip-template-transclude.directive";
import { TooltipTemplate } from "./tooltip/directives/tooltip-template.directive";
import { Tooltip } from "./tooltip/directives/tooltip.directive";
import { TooltipProvider } from "./tooltip/providers/tooltip.provider";

export const UI_LIB_NAME = angular.module("ui-lib", [])
    .directive("uibModalBackdrop", UibModalBackdrop)
    .directive("uibModalWindow", UibModalWindow)
    .directive("uibModalAnimationClass", UibModalAnimationClass)
    .directive("uibModalTransclude", UibModalTransclude)
    .directive("uibTooltipTemplateTransclude", TooltipTemplateTransclude)
    .directive("uibTooltipClasses", TooltipClasses)
    .directive("uibTooltipPopup", TooltipPopup)
    .directive("uibTooltip", Tooltip)
    .directive("uibTooltipTemplatePopup", TooltipTemplatePopup)
    .directive("uibTooltipTemplate", TooltipTemplate)
    .directive("uibTooltipHtmlPopup", TooltipHtmlPopup)
    .directive("uibTooltipHtml", TooltipHtml)
    .provider("$uibResolve", Resolver)
    .provider("$uibTooltip", TooltipProvider as any)
    .service("$uibPosition", Position)
    .service("$$multiMap", MultiMapFactory)
    .service("$$stackedMap", StackedMapFactory)
    .service("$uibModalStack", ModalStack)
    .service("$uiLibModal", UiLibModal)
    .service("modalManager", ModalManager)
    .run(["$templateCache", ($templateCache: ITemplateCacheService) => {
        $templateCache.put(
            "uib/template/modal/window.html",
            require("./modal/window.htm"));
        $templateCache.put(
            "uib/template/tooltip/tooltip-popup.html",
            require("./tooltip/templates/tooltip-popup.htm"));
        $templateCache.put(
            "uib/template/tooltip/tooltip-template-popup.html",
            require("./tooltip/templates/tooltip-template-popup.htm"));
        $templateCache.put(
            "uib/template/tooltip/tooltip-html-popup.html",
            require("./tooltip/templates/tooltip-html-popup.htm"));
    }]).name;
