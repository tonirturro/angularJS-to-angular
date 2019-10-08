# angularJS-to-angular
Steps to port and AngularJS front end to Angular

## Summary

Based on a electron app project we will migrate the front end displayed at the render process to Angular 7 while keeping unchanged the backend running on the main process.

We will follow the steps documented at https://angular.io/guide/upgrade

## Steps

* step0  : Starting point.
* step1  : Angular/AngularJS dual boot.
* step2  : Decouple routes from services.
* step3  : Migrate services and setup hybrid test.
* step4  : Decouple modals from routes.
* step5  : Add extra user interface and localization.
* step6  : First working Angular component in AngularJS context.
* step7  : Adding localization to the Angular component.
* step8  : Adapt build to Angular components.
* step9  : Migrate components not depending on ui-lib.
* step10 : Migrate components depending on ui-lib.
* step11 : Use Ng-Ui-Lib from main component and remove UiLib.
* step12 : Manage routes from Angular version of ui-router.
* step13 : Migrate main component.
* step14 : Remove AngularJS references.
* step15 : Use the Angular CLI tool.
* appendixA : Create distributable bundle.
* appendixB : Use the right build for distributable bundle.

To go to a particular step:

```sh
git checkout [step]
```
