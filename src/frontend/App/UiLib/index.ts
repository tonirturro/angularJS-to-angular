import * as angular from "angular";
import { ITemplateCacheService } from "angular";
import { UibModalAnimationClass } from "./modal/directives/animation";
import { UibModalBackdrop } from "./modal/directives/backdrop";
import { UibModalTransclude } from "./modal/directives/transclude";
import { UibModalWindow } from "./modal/directives/window";
import { UiLibModal } from "./modal/services/modal";
import { ModalStack } from "./modal/services/modalStack";
import { Resolver } from "./modal/services/resolver";
import { MultiMapFactory } from "./multiMap/multiMapFactory";
import { Position } from "./position/position";
import { StackedMapFactory } from "./stackedMap/stakedMapFactory";

export const UI_LIB_NAME = angular.module("ui-lib", [])
    .directive("uibModalBackdrop", UibModalBackdrop)
    .directive("uibModalWindow", UibModalWindow)
    .directive("uibModalAnimationClass", UibModalAnimationClass)
    .directive("uibModalTransclude", UibModalTransclude)
    .provider("$uibResolve", Resolver)
    .service("$uibPosition", Position)
    .service("$$multiMap", MultiMapFactory)
    .service("$$stackedMap", StackedMapFactory)
    .service("$uibModalStack", ModalStack)
    .service("$uiLibModal", UiLibModal)
    .run(["$templateCache", ($templateCache: ITemplateCacheService) => {
        $templateCache.put("uib/template/modal/window.html", require("./modal/window.htm"));
    }]).name;
