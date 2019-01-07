import { IComponentOptions } from "angular";
import { MainPageController } from "./main-page.component.ctrl";
import "./main-page.styles.scss";

/**
 * Wraps the components into the Single Page Application
 */
export const MainPage: IComponentOptions = {
    controller: MainPageController,
    controllerAs: "mainPageController",
    templateUrl: "main-page.template.htm"
};
