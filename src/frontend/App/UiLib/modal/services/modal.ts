import {
        IDocumentService,
        IPromise,
        IQService,
        IRootScopeService,
        ITemplateRequestService} from "angular";
import * as angular from "angular";
import { IModalInstanceService, IModalService, IModalSettings, IModalStackService, IResolver } from "../../definitions";

export class UiLibModal implements IModalService {

    public static $inject = [
        "$rootScope",
        "$q",
        "$document",
        "$templateRequest",
        "$controller",
        "$uibModalStack",
        "$uibResolve"];

    private readonly options = {
        animation: true,
        backdrop: true, // can also be false or 'static'
        keyboard: true
    };

    private promiseChain: IPromise<any> = null;

    constructor(
        private $rootScope: IRootScopeService,
        private $q: IQService,
        private $document: IDocumentService,
        private $templateRequest: ITemplateRequestService,
        private $controller: any,
        private $modalStack: IModalStackService,
        private $uibResolve: IResolver) { }

    /**
     * Returns the combined promise dependency
     */
    public getPromiseChain(): IPromise<any> {
        return this.promiseChain;
    }

    /**
     * Creates a modal dialog instance
     * @param modalOptions defines the dialog properties
     */
    public open(modalOptions: IModalSettings): IModalInstanceService {
        const modalResultDeferred = this.$q.defer();
        const modalOpenedDeferred = this.$q.defer();
        const modalClosedDeferred = this.$q.defer();
        const modalRenderDeferred = this.$q.defer();

        // prepare an instance of a modal to be injected into controllers and returned to a caller
        const modalInstance = {
            close: (result) => {
                return this.$modalStack.close(modalInstance, result);
            },
            closed: modalClosedDeferred.promise,
            dismiss: (reason) => {
                return this.$modalStack.dismiss(modalInstance, reason);
            },
            opened: modalOpenedDeferred.promise,
            rendered: modalRenderDeferred.promise,
            result: modalResultDeferred.promise
        };

        // merge and clean up options
        modalOptions = angular.extend({}, this.options, modalOptions);
        modalOptions.resolve = modalOptions.resolve || {};
        modalOptions.appendTo = modalOptions.appendTo || this.$document.find("body").eq(0);

        if (!modalOptions.appendTo.length) {
            throw new Error("appendTo element not found. Make sure that the element passed is in DOM.");
        }

        // verify options
        if (!modalOptions.component && !modalOptions.template && !modalOptions.templateUrl) {
            throw new Error("One of component or template or templateUrl options is required.");
        }

        let templateAndResolvePromise;
        const resolveWithTemplate = () => templateAndResolvePromise;
        if (modalOptions.component) {
            templateAndResolvePromise = this.$q.when(this.$uibResolve.resolve(modalOptions.resolve, {}, null, null));
        } else {
            templateAndResolvePromise =
                this.$q.all([
                    this.getTemplatePromise(modalOptions),
                    this.$uibResolve.resolve(modalOptions.resolve, {}, null, null)]);
        }
        // Wait for the resolution of the existing promise chain.
        // Then switch to our own combined promise dependency (regardless of how the previous modal fared).
        // Then add to $modalStack and resolve opened.
        // Finally clean up the chain variable if no subsequent modal has overwritten it.
        const samePromise = this.promiseChain = this.$q.all([this.promiseChain])
            .then(resolveWithTemplate, resolveWithTemplate)
            .then((tplAndVars) => {
                const providedScope = modalOptions.scope || this.$rootScope;

                const modalScope: any = providedScope.$new();
                modalScope.$close = modalInstance.close;
                modalScope.$dismiss = modalInstance.dismiss;

                modalScope.$on("$destroy", () => {
                    if (!modalScope.$$uibDestructionScheduled) {
                        modalScope.$dismiss("$uibUnscheduledDestruction");
                    }
                });

                const modal = {
                    animation: modalOptions.animation,
                    appendTo: modalOptions.appendTo,
                    ariaDescribedBy: modalOptions.ariaDescribedBy,
                    ariaLabelledBy: modalOptions.ariaLabelledBy,
                    backdrop: modalOptions.backdrop,
                    backdropClass: modalOptions.backdropClass,
                    closedDeferred: modalClosedDeferred,
                    component: undefined,
                    content: undefined,
                    deferred: modalResultDeferred,
                    keyboard: modalOptions.keyboard,
                    openedClass: modalOptions.openedClass,
                    renderDeferred: modalRenderDeferred,
                    scope: modalScope,
                    size: modalOptions.size,
                    windowClass: modalOptions.windowClass,
                    windowTemplateUrl: modalOptions.windowTemplateUrl,
                    windowTopClass: modalOptions.windowTopClass
                };

                const component = {
                    name: undefined
                };
                let ctrlInstance = {
                    $close: undefined,
                    $dismiss: undefined,
                    $onInit: undefined
                };
                let ctrlInstantiate: any = {
                    instance: undefined,
                };
                const ctrlLocals = {
                    $scope: undefined
                };

                if (modalOptions.component) {
                    constructLocals(component, false, true, false);
                    component.name = modalOptions.component;
                    modal.component = component;
                } else if (modalOptions.controller) {
                    constructLocals(ctrlLocals, true, false, true);

                    // the third param will make the controller instantiate later,private api
                    // @see https://github.com/angular/angular.js/blob/master/src/ng/controller.js#L126
                    ctrlInstantiate =
                        this.$controller(modalOptions.controller, ctrlLocals, true, modalOptions.controllerAs);
                    if (modalOptions.controllerAs && modalOptions.bindToController) {
                        ctrlInstance = ctrlInstantiate.instance;
                        ctrlInstance.$close = modalScope.$close;
                        ctrlInstance.$dismiss = modalScope.$dismiss;
                        angular.extend(ctrlInstance, {
                            $resolve: ctrlLocals.$scope.$resolve
                        }, providedScope);
                    }

                    ctrlInstance = ctrlInstantiate();

                    if (angular.isFunction(ctrlInstance.$onInit)) {
                        ctrlInstance.$onInit();
                    }
                }

                if (!modalOptions.component) {
                    modal.content = tplAndVars[0];
                }

                this.$modalStack.open(modalInstance, modal);
                modalOpenedDeferred.resolve(true);

                function constructLocals(obj, template, instanceOnScope, injectable) {
                    obj.$scope = modalScope;
                    obj.$scope.$resolve = {};
                    if (instanceOnScope) {
                        obj.$scope.$uibModalInstance = modalInstance;
                    } else {
                        obj.$uibModalInstance = modalInstance;
                    }

                    const resolves = template ? tplAndVars[1] : tplAndVars;
                    angular.forEach(resolves, (value, key) => {
                        if (injectable) {
                            obj[key] = value;
                        }

                        obj.$scope.$resolve[key] = value;
                    });
                }
            }, function resolveError(reason) {
                modalOpenedDeferred.reject(reason);
                modalResultDeferred.reject(reason);
            }).finally(() => {
                if (this.promiseChain === samePromise) {
                    this.promiseChain = null;
                }
            });

        return modalInstance;
    }

    private getTemplatePromise(options: IModalSettings) {
        return options.template ? this.$q.when(options.template) :
            this.$templateRequest(angular.isFunction(options.templateUrl) ?
                options.templateUrl() : options.templateUrl);
    }

}
