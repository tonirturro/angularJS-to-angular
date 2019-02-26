import * as angular from "angular";
import {
    ICompileProvider,
    ICompileService,
    IControllerProvider,
    IDocumentService,
    IQService,
    IRootScopeService,
    ITemplateCacheService,
    ITimeoutService
} from "angular";
import * as $ from "jquery";
import {
    IModalInstanceService,
    IModalService,
    IModalSettings,
    IModalStackService
} from "../../definitions";

describe("Given a modal service", () => {
    let serviceToTest: IModalService;
    let rootScope: IRootScopeService;
    let animate: angular.animate.IAnimateService;
    let documentService: IDocumentService;
    let uibModalStack: IModalStackService;
    let q: IQService;
    let templateCache: ITemplateCacheService;
    let controllerProvider: IControllerProvider;
    let timeout: ITimeoutService;
    let compile: ICompileService;

    const triggerKeyDown = (element: any, keyCode: number, shiftKey?: boolean) => {
        const e = $.Event("keydown") as any;
        e.srcElement = element[0];
        e.which = keyCode;
        e.shiftKey = shiftKey;
        element.trigger(e);
    };

    const open = (modalOptions: IModalSettings, noFlush?: boolean, noDigest?: boolean) => {
        const modal: IModalInstanceService = serviceToTest.open(modalOptions);
        modal.opened.catch(angular.noop);
        modal.result.catch(angular.noop);
        if (!noDigest) {
            rootScope.$digest();
            if (!noFlush) {
                animate.flush();
            }
        }
        return modal;
    };

    const close = (modal: IModalInstanceService, result?: any, noFlush?: boolean) => {
        const closed = modal.close(result);
        rootScope.$digest();
        if (!noFlush) {
            animate.flush();
            rootScope.$digest();
            animate.flush();
            rootScope.$digest();
        }
        return closed;
    };

    const dismiss = (modal: IModalInstanceService, reason?: any, noFlush?: boolean) => {
        const closed = modal.dismiss(reason);
        rootScope.$digest();
        if (!noFlush) {
            animate.flush();
            rootScope.$digest();
            animate.flush();
            rootScope.$digest();
        }
        return closed;
    };

    beforeEach(angular.mock.module("ngAnimateMock"));
    beforeEach(angular.mock.module("ui-lib"));
    beforeEach(angular.mock.module((
        $controllerProvider: IControllerProvider,
        $compileProvider: ICompileProvider) => {
        controllerProvider = $controllerProvider;
        $compileProvider.directive("parentDirective", () => {
            return {
                controller() {
                    this.text = "foo";
                }
            };
        }).directive("childDirective", () => {
            return {
                require: "^parentDirective",
                link(scope: any, elem: any, attrs: any, ctrl: any) {
                    scope.text = ctrl.text;
                }
            };
        }).directive("focusMe", () => {
            return {
                link(scope, elem, attrs) {
                    elem.focus();
                }
            };
        }).component("fooBarAngular", {
            bindings: {
                "(close)": "&",
                "(dismiss)": "&",
                "[modalInstance]": "<",
                "[resolve]": "<"
            },
            controller: angular.noop,
            controllerAs: "foobar",
            template: "<div>Foo Angular Bar</div>"
        }).component("fooBar", {
            bindings: {
                close: "&",
                dismiss: "&",
                modalInstance: "<",
                resolve: "<"
            },
            controller: angular.noop,
            controllerAs: "foobar",
            template: "<div>Foo Bar</div>"
        });
    }));

    beforeEach(inject((
        $uiLibModal: IModalService,
        $rootScope: IRootScopeService,
        $animate: angular.animate.IAnimateService,
        $document: IDocumentService,
        $uibModalStack: IModalStackService,
        $q: IQService,
        $templateCache: ITemplateCacheService,
        $timeout: ITimeoutService,
        $compile: ICompileService) => {
        serviceToTest = $uiLibModal;
        rootScope = $rootScope;
        animate = $animate;
        documentService = $document;
        uibModalStack = $uibModalStack;
        q = $q;
        templateCache = $templateCache;
        timeout = $timeout;
        compile = $compile;
    }));

    beforeEach(() => {
        jasmine.addMatchers({
            toBeRejectedWith: (
                util: jasmine.MatchersUtil,
                customEqualityTesters: jasmine.CustomEqualityTester[]) => {
                return {
                    compare: (promise, expected) => {
                        const resultFromTest = {
                            message: undefined
                        };
                        let called = false;

                        promise.then((result) => {
                            fail(`Expected '${angular.mock.dump(result)}' to be rejected with ' ${expected}+ '.`);
                        }, (result) => {
                            expect(result).toEqual(expected);

                            if (result === expected) {
                                resultFromTest.message = `Expected '${angular.mock.dump(result)} ` +
                                    `not to be rejected with '${expected}'".`;
                            } else {
                                resultFromTest.message = `Expected '${angular.mock.dump(result)}' ` +
                                    `to be rejected with '${expected}'.`;
                            }
                            // tslint:disable-next-line:no-string-literal
                        })["finally"](() => {
                            called = true;
                        });

                        rootScope.$digest();

                        if (!called) {
                            fail(`Expected '${angular.mock.dump(resultFromTest)} to be rejected with '${expected}'.`);
                        }
                        return { pass: true };
                    }
                };
            },
            toBeResolvedWith: (
                util: jasmine.MatchersUtil,
                customEqualityTesters: jasmine.CustomEqualityTester[]) => {
                return {
                    compare: (promise: Promise<any>, expected: Promise<any>) => {
                        let resultFromPromise = {
                            message: undefined
                        };
                        let called = false;

                        promise.then((result) => {
                            expect(result).toEqual(expected);

                            if (result === expected) {
                                resultFromPromise.message = `Expected "${angular.mock.dump(result)}"` +
                                    ` not to be resolved with "${expected}.`;
                            } else {
                                resultFromPromise.message = `Expected '${angular.mock.dump(result)}' ` +
                                    `to be resolved with '${expected}'.`;
                            }
                        }, (result) => {
                            resultFromPromise = result;
                            fail(`Expected '${angular.mock.dump(result)}' to be resolved with '${expected}'.`);
                            // tslint:disable-next-line:no-string-literal
                        })["finally"](() => {
                            called = true;
                        });

                        rootScope.$digest();

                        if (!called) {
                            fail(`Expected "${angular.mock.dump(resultFromPromise)}" ` +
                                `to be resolved with "${expected}".`);
                        }

                        return { pass: true };
                    }
                };
            },
            toHaveBackdrop: (
                util: jasmine.MatchersUtil,
                customEqualityTesters: jasmine.CustomEqualityTester[]) => {
                return {
                    compare: (actual, expected) => {
                        const backdropDomEls = actual.find("body > div.modal-backdrop");

                        const result = {
                            message: undefined,
                            pass: util.equals(backdropDomEls.length, 1, customEqualityTesters)
                        };

                        if (result.pass) {
                            result.message = `Expected ${angular.mock.dump(backdropDomEls)} ` +
                                `not to be a backdrop element".`;
                        } else {
                            result.message = `Expected ${angular.mock.dump(backdropDomEls)} ` +
                                `to be a backdrop element".`;
                        }
                        return result;
                    }
                };
            },
            toHaveClass: () => {
                return {
                    compare: (actual, className) => {
                        return {
                            pass: $(actual).hasClass(className)
                        };
                    }
                };
            },
            toHaveFocus: () => {
                return {
                    compare: (actual) => {
                        const result = {
                            message: undefined,
                            pass: document.activeElement === actual
                        };

                        if (result.pass) {
                            result.message = `Expected  '${angular.mock.dump(actual)}' not to have focus`;
                        } else {
                            result.message = `Expected  '${angular.mock.dump(actual)}' to have focus`;
                        }

                        return result;
                    }
                };
            },
            toHaveModalOpenWithContent: (
                util: jasmine.MatchersUtil,
                customEqualityTesters: jasmine.CustomEqualityTester[]) => {
                return {
                    compare: (actual, content, selector) => {
                        let contentToCompare;
                        const modalDomEls = actual.find("body > div.modal > div.modal-dialog > div.modal-content");
                        contentToCompare = selector ? modalDomEls.find(selector) : modalDomEls;
                        const result = {
                            message: undefined,
                            pass: modalDomEls.css("display") === "block" && contentToCompare.html() === content
                        };

                        if (result.pass) {
                            result.message = `Expected ${angular.mock.dump(modalDomEls)} ' +
                                             'not to be open with ${content}.`;
                        } else {
                            result.message = `Expected ${angular.mock.dump(modalDomEls)} to be open with ${content}.`;
                        }

                        return result;
                    }
                };
            },
            toHaveModalsOpen: (
                util: jasmine.MatchersUtil,
                customEqualityTesters: jasmine.CustomEqualityTester[]): jasmine.CustomMatcher => {
                return {
                    compare: (actual, expected) => {
                        const modalDomEls = actual.find("body > div.modal");

                        const result = {
                            message: undefined,
                            pass: util.equals(modalDomEls.length, expected, customEqualityTesters)
                        };

                        if (result.pass) {
                            result.message = `Expected ` +
                                `"${angular.mock.dump(modalDomEls)}" not to have ` +
                                `"${expected}" modals opened`;
                        } else {
                            result.message = `Expected ` +
                                `"${angular.mock.dump(modalDomEls)}" to have` +
                                `"${expected}" modals opened`;
                        }

                        return result;
                    }
                };
            }
        });
    });

    afterEach(() => {
        const body = documentService.find("body");
        body.find("div.modal").remove();
        body.find("div.modal-backdrop").remove();
        body.removeClass("modal-open");
        documentService.off("keydown");
    });

    describe("and basic scenarios with default options", () => {
        it("should open and dismiss a modal with a minimal set of options", () => {
            const modal = open({ template: "<div>Content</div>" });

            expect(documentService).toHaveModalsOpen(1);
            expect(documentService).toHaveModalOpenWithContent("Content", "div");
            expect(documentService).toHaveBackdrop();

            dismiss(modal, "closing in test");

            expect(documentService).toHaveModalsOpen(0);
            expect(documentService).not.toHaveBackdrop();
        });

        it("should compile modal before inserting into DOM", () => {
            let topModal;

            const modalInstance = {
                close: (result) => {
                    return uibModalStack.close(modalInstance, result);
                },
                closed: q.defer(),
                dismiss: (reason) => {
                    return uibModalStack.dismiss(modalInstance, reason);
                },
                opened: q.defer(),
                rendered: q.defer(),
                result: q.defer(),
            } as any;

            const expectedText = "test";
            uibModalStack.open(modalInstance, {
                appendTo: angular.element(document.body),
                closedDeferred: modalInstance.closed,
                content: `<div id="test">{{ "${expectedText}" }}</div>`,
                deferred: modalInstance.result,
                renderDeferred: modalInstance.rendered,
                scope: rootScope.$new()
            });

            topModal = uibModalStack.getTop();

            expect(topModal.value.modalDomEl.find("#test").length).toEqual(0);
            expect(angular.element("#test").length).toEqual(0);

            rootScope.$digest();

            expect(topModal.value.modalDomEl.find("#test").text()).toEqual(expectedText);
            expect(angular.element("#test").text()).toEqual(expectedText);

            animate.flush();

            close(modalInstance, "closing in test", true);
        });

        it("should resolve rendered promise when animation is complete", () => {
            const modalInstance = {
                close(result) {
                    return uibModalStack.close(modalInstance, result);
                },
                closed: q.defer(),
                dismiss(reason) {
                    return uibModalStack.dismiss(modalInstance, reason);
                },
                opened: q.defer(),
                rendered: q.defer(),
                result: q.defer()
            } as any;
            let rendered = false;
            modalInstance.rendered.promise.then(() => {
                rendered = true;
            });

            uibModalStack.open(modalInstance, {
                appendTo: angular.element(document.body),
                closedDeferred: modalInstance.closed,
                content: '<div id="test">test</div>',
                deferred: modalInstance.result,
                renderDeferred: modalInstance.rendered,
                scope: rootScope.$new()
            });

            rootScope.$digest();

            expect(rendered).toBe(false);

            animate.flush();

            expect(rendered).toBe(true);
        });

        it("should not throw an exception on a second dismiss", () => {
            const modal = open({ template: "<div>Content</div>" });

            expect(documentService).toHaveModalsOpen(1);
            expect(documentService).toHaveModalOpenWithContent("Content", "div");
            expect(documentService).toHaveBackdrop();

            dismiss(modal, "closing in test");

            expect(documentService).toHaveModalsOpen(0);

            dismiss(modal, "closing in test", true);
        });

        it("should not throw an exception on a second close", () => {
            const modal = open({ template: "<div>Content</div>" });

            expect(documentService).toHaveModalsOpen(1);
            expect(documentService).toHaveModalOpenWithContent("Content", "div");
            expect(documentService).toHaveBackdrop();

            close(modal, "closing in test");

            expect(documentService).toHaveModalsOpen(0);

            close(modal, "closing in test", true);
        });

        it("should open a modal from templateUrl", () => {
            templateCache.put("content.html", "<div>URL Content</div>");
            const modal = open({ templateUrl: "content.html" });

            expect(documentService).toHaveModalsOpen(1);
            expect(documentService).toHaveModalOpenWithContent("URL Content", "div");
            expect(documentService).toHaveBackdrop();

            dismiss(modal, "closing in test");

            expect(documentService).toHaveModalsOpen(0);

            expect(documentService).not.toHaveBackdrop();
        });

        it("should support closing on ESC", () => {
            open({ template: "<div>Content</div>" });
            expect(documentService).toHaveModalsOpen(1);

            triggerKeyDown(documentService, 27);
            animate.flush();
            rootScope.$digest();
            animate.flush();
            rootScope.$digest();

            expect(documentService).toHaveModalsOpen(0);
        });

        it("should not close on ESC if event.preventDefault() was issued", () => {
            const modal = open({ template: "<div><button>x</button></div>" });
            expect(documentService).toHaveModalsOpen(1);

            const button = angular.element("button").on("keydown", preventKeyDown);

            triggerKeyDown(button, 27);
            rootScope.$digest();

            expect(documentService).toHaveModalsOpen(1);

            button.off("keydown", preventKeyDown);

            triggerKeyDown(button, 27);
            animate.flush();
            rootScope.$digest();
            animate.flush();
            rootScope.$digest();

            expect(documentService).toHaveModalsOpen(0);

            function preventKeyDown(evt) {
                evt.preventDefault();
            }
        });

        it("should support closing on backdrop click", () => {
            const modal = open({ template: "<div>Content</div>" });
            expect(documentService).toHaveModalsOpen(1);

            documentService.find("body > div.modal").click();
            animate.flush();
            rootScope.$digest();
            animate.flush();
            rootScope.$digest();

            expect(documentService).toHaveModalsOpen(0);
        });

        it("should return to the element which had focus before the dialog was invoked", () => {
            const link = "<a href>Link</a>";
            const element = angular.element(link);
            angular.element(document.body).append(element);
            element.focus();
            expect(document.activeElement.tagName).toBe("A");

            const modal = open({ template: "<div>Content<button>inside modal</button></div>" });
            rootScope.$digest();
            expect(document.activeElement.className.split(" ")).toContain("modal");
            expect(documentService).toHaveModalsOpen(1);

            triggerKeyDown(documentService, 27);
            animate.flush();
            rootScope.$digest();
            animate.flush();
            rootScope.$digest();

            expect(document.activeElement.tagName).toBe("A");
            expect(documentService).toHaveModalsOpen(0);

            element.remove();
        });

        it("should return to document.body if element which had focus before " +
            "the dialog was invoked is gone, or is missing focus function", () => {
                const link = "<a href>Link</a>";
                const element = angular.element(link);
                angular.element(document.body).append(element);
                element.focus();
                expect(document.activeElement.tagName).toBe("A");

                open({ template: "<div>Content</div>" });
                rootScope.$digest();
                expect(document.activeElement.tagName).toBe("DIV");
                expect(documentService).toHaveModalsOpen(1);

                // Fake undefined focus function, happening in IE in certain
                // iframe conditions. See issue 3639
                element[0].focus = undefined;
                triggerKeyDown(documentService, 27);
                animate.flush();
                rootScope.$digest();
                animate.flush();
                rootScope.$digest();

                expect(document.activeElement.tagName).toBe("BODY");
                expect(documentService).toHaveModalsOpen(0);
                element.remove();
            });

        it("should resolve returned promise on close", () => {
            const modal = open({ template: "<div>Content</div>" });
            close(modal, "closed ok");

            expect(modal.result).toBeResolvedWith("closed ok");
        });

        it("should reject returned promise on dismiss", () => {
            const modal = open({ template: "<div>Content</div>" });
            dismiss(modal, "esc");

            expect(modal.result).toBeRejectedWith("esc");
        });

        it("should reject returned promise on unexpected closure", () => {
            const scope = rootScope.$new();
            const modal = open({ template: "<div>Content</div>", scope });
            scope.$destroy();

            expect(modal.result).toBeRejectedWith("$uibUnscheduledDestruction");

            animate.flush();
            rootScope.$digest();
            animate.flush();
            rootScope.$digest();
            expect(documentService).toHaveModalsOpen(0);
        });

        it("should resolve the closed promise when modal is closed", () => {
            const modal = open({ template: "<div>Content</div>" });
            let closed = false;
            close(modal, "closed ok");

            modal.closed.then(() => {
                closed = true;
            });

            rootScope.$digest();

            expect(closed).toBe(true);
        });

        it("should resolve the closed promise when modal is dismissed", () => {
            const modal = open({ template: "<div>Content</div>" });
            let closed = false;
            dismiss(modal, "esc");

            modal.closed.then(() => {
                closed = true;
            });

            rootScope.$digest();

            expect(closed).toBe(true);
        });

        it("should expose a promise linked to the templateUrl / resolve promises", () => {
            const modal = open({
                resolve: {
                    ok() { return q.when("ok"); }
                },
                template: "<div>Content</div>"
            }
            );
            expect(modal.opened).toBeResolvedWith(true);
        });

        it("should expose a promise linked to the templateUrl / resolve promises and reject it if needed", () => {
            const modal = open({
                resolve: {
                    ok() { return q.reject("ko"); }
                },
                template: "<div>Content</div>"
            }, true);
            expect(modal.opened).toBeRejectedWith("ko");
        });

        it("should focus on the element that has autofocus attribute " +
            "when the modal is open/reopen and the animations have finished", () => {
                function openAndCloseModalWithAutofocusElement() {
                    const modal = open({
                        template: '<div><input type="text" id="auto-focus-element" autofocus></div>'
                    });
                    rootScope.$digest();
                    expect(angular.element("#auto-focus-element").get(0)).toHaveFocus();

                    close(modal, "closed ok");

                    expect(modal.result).toBeResolvedWith("closed ok");
                }

                openAndCloseModalWithAutofocusElement();
                openAndCloseModalWithAutofocusElement();
            });

        xit("should not focus on the element that has autofocus attribute " +
            "when the modal is opened and something in the modal already has focus " +
            "and the animations have finished", () => {
                function openAndCloseModalWithAutofocusElement() {

                    const modal = open({
                        template: '<div><input type="text" id="pre-focus-element" focus-me>' +
                            '<input type="text" id="auto-focus-element" autofocus></div>'
                    });
                    rootScope.$digest();
                    expect(angular.element("#auto-focus-element")).not.toHaveFocus();
                    expect(angular.element("#pre-focus-element")).toHaveFocus();

                    close(modal, "closed ok");

                    expect(modal.result).toBeResolvedWith("closed ok");
                }

                openAndCloseModalWithAutofocusElement();
                openAndCloseModalWithAutofocusElement();
            });

        it("should wait until the in animation is finished " +
            "before attempting to focus the modal or autofocus element", () => {
                function openAndCloseModalWithAutofocusElement() {
                    const modal = open({
                        template: '<div><input type="text" id="auto-focus-element" autofocus></div>'
                    }, true, true);
                    expect(angular.element("#auto-focus-element").get(0)).not.toHaveFocus();

                    rootScope.$digest();
                    animate.flush();

                    // expect(angular.element("#auto-focus-element").get(0)).toHaveFocus();

                    close(modal, "closed ok");

                    expect(modal.result).toBeResolvedWith("closed ok");
                }

                function openAndCloseModalWithOutAutofocusElement() {
                    const link = "<a href>Link</a>";
                    const element = angular.element(link);
                    angular.element(document.body).append(element);
                    element.focus();
                    expect(document.activeElement.tagName).toBe("A");

                    const modal = open({ template: '<div><input type="text"></div>' }, true, true);
                    expect(document.activeElement.tagName).toBe("A");

                    rootScope.$digest();
                    animate.flush();

                    expect(document.activeElement.className.split(" ")).toContain("modal");

                    close(modal, "closed ok");

                    expect(modal.result).toBeResolvedWith("closed ok");

                    element.remove();
                }

                openAndCloseModalWithAutofocusElement();
                openAndCloseModalWithOutAutofocusElement();
            });

        it("should change focus to first element when tab key was pressed", () => {
            const initialPage = angular.element('<a href="#" id="cannot-get-focus-from-modal">Outland link</a>');
            angular.element(document.body).append(initialPage);
            initialPage.focus();

            open({
                template: '<a href="#" id="tab-focus-link">' +
                    '<input type="text" id="tab-focus-input1"/>' +
                    '<input type="text" id="tab-focus-input2"/>' +
                    '<button id="tab-focus-button">Open me!</button>'
            });
            expect(documentService).toHaveModalsOpen(1);

            const lastElement = angular.element(document.getElementById("tab-focus-button"));
            lastElement.focus();
            triggerKeyDown(lastElement, 9);
            expect(document.activeElement.getAttribute("id")).toBe("tab-focus-link");

            initialPage.remove();
        });

        it("should change focus to last element when shift+tab key is pressed", () => {
            const initialPage = angular.element('<a href="#" id="cannot-get-focus-from-modal">Outland link</a>');
            angular.element(document.body).append(initialPage);
            initialPage.focus();

            open({
                template: '<a href="#" id="tab-focus-link">' +
                    '<input type="text" id="tab-focus-input1"/>' +
                    '<input type="text" id="tab-focus-input2"/>' +
                    '<button id="tab-focus-button">Open me!</button>'
            });
            rootScope.$digest();
            expect(documentService).toHaveModalsOpen(1);

            triggerKeyDown(angular.element(document.activeElement), 9, true);
            expect(document.activeElement.getAttribute("id")).toBe("tab-focus-button");

            const lastElement = angular.element(document.getElementById("tab-focus-link"));
            lastElement.focus();
            triggerKeyDown(angular.element(document.activeElement), 9, true);
            expect(document.activeElement.getAttribute("id")).toBe("tab-focus-button");

            initialPage.remove();
        });

        it("should change focus to first element when tab key is pressed when keyboard is false", () => {
            const initialPage = angular.element('<a href="#" id="cannot-get-focus-from-modal">Outland link</a>');
            angular.element(document.body).append(initialPage);
            initialPage.focus();

            open({
                keyboard: false,
                template: '<a href="#" id="tab-focus-link">' +
                    '<input type="text" id="tab-focus-input1"/>' +
                    '<input type="text" id="tab-focus-input2"/>' +
                    '<button id="tab-focus-button">Open me!</button>',
            });
            expect(documentService).toHaveModalsOpen(1);

            const lastElement = angular.element(document.getElementById("tab-focus-button"));
            lastElement.focus();
            triggerKeyDown(lastElement, 9);
            expect(document.activeElement.getAttribute("id")).toBe("tab-focus-link");

            initialPage.remove();
        });

        it("should change focus to last element when shift+tab keys are pressed when keyboard is false", () => {
            const initialPage = angular.element('<a href="#" id="cannot-get-focus-from-modal">Outland link</a>');
            angular.element(document.body).append(initialPage);
            initialPage.focus();

            open({
                keyboard: false,
                template: '<a href="#" id="tab-focus-link">' +
                    '<input type="text" id="tab-focus-input1"/>' +
                    '<input type="text" id="tab-focus-input2"/>' +
                    '<button id="tab-focus-button">Open me!</button>'
            });
            rootScope.$digest();
            expect(documentService).toHaveModalsOpen(1);

            triggerKeyDown(angular.element(document.activeElement), 9, true);
            expect(document.activeElement.getAttribute("id")).toBe("tab-focus-button");

            const lastElement = angular.element(document.getElementById("tab-focus-link"));
            lastElement.focus();
            triggerKeyDown(angular.element(document.activeElement), 9, true);
            expect(document.activeElement.getAttribute("id")).toBe("tab-focus-button");

            initialPage.remove();
        });

        it("should change focus to next proper element when DOM changes and tab is pressed", () => {
            const initialPage = angular.element('<a href="#" id="cannot-get-focus-from-modal">Outland link</a>');
            angular.element(document.body).append(initialPage);
            initialPage.focus();

            open({
                keyboard: false,
                template: '<a href="#" id="tab-focus-link1">a</a>' +
                    '<a href="#" id="tab-focus-link2">b</a>' +
                    '<a href="#" id="tab-focus-link3">c</a>' +
                    '<button id="tab-focus-button">Open me!</button>'
            });
            rootScope.$digest();
            expect(documentService).toHaveModalsOpen(1);

            $("#tab-focus-link3").focus();
            expect(document.activeElement.getAttribute("id")).toBe("tab-focus-link3");

            $("#tab-focus-button").remove();
            triggerKeyDown(angular.element(document.activeElement), 9, false);
            expect(document.activeElement.getAttribute("id")).toBe("tab-focus-link1");

            initialPage.remove();
        });

        it("should change focus to next proper element when DOM changes and shift+tab is pressed", () => {
            const initialPage = angular.element('<a href="#" id="cannot-get-focus-from-modal">Outland link</a>');
            angular.element(document.body).append(initialPage);
            initialPage.focus();

            open({
                keyboard: false,
                template: '<a href="#" id="tab-focus-link1">a</a>' +
                    '<a href="#" id="tab-focus-link2">b</a>' +
                    '<a href="#" id="tab-focus-link3">c</a>' +
                    '<button id="tab-focus-button">Open me!</button>'
            });
            rootScope.$digest();
            expect(documentService).toHaveModalsOpen(1);

            $("#tab-focus-link1").focus();
            expect(document.activeElement.getAttribute("id")).toBe("tab-focus-link1");

            $("#tab-focus-button").remove();
            triggerKeyDown(angular.element(document.activeElement), 9, true);
            expect(document.activeElement.getAttribute("id")).toBe("tab-focus-link3");

            initialPage.remove();
        });

        it("should change focus to next non-hidden element when tab is pressed", () => {
            const initialPage = angular.element('<a href="#" id="cannot-get-focus-from-modal">Outland link</a>');
            angular.element(document.body).append(initialPage);
            initialPage.focus();

            open({
                keyboard: false,
                template: '<a href="#" id="tab-focus-link1">a</a>' +
                    '<a href="#" id="tab-focus-link2">b</a>' +
                    '<a href="#" id="tab-focus-link3">c</a>' +
                    '<button id="tab-focus-button">Open me!</button>'
            });
            rootScope.$digest();
            expect(documentService).toHaveModalsOpen(1);

            $("#tab-focus-link3").focus();
            expect(document.activeElement.getAttribute("id")).toBe("tab-focus-link3");

            $("#tab-focus-button").css("display", "none");
            triggerKeyDown(angular.element(document.activeElement), 9, false);
            expect(document.activeElement.getAttribute("id")).toBe("tab-focus-link1");

            initialPage.remove();
        });

        it("should change focus to previous non-hidden element when shift+tab is pressed", () => {
            const initialPage = angular.element('<a href="#" id="cannot-get-focus-from-modal">Outland link</a>');
            angular.element(document.body).append(initialPage);
            initialPage.focus();

            open({
                keyboard: false,
                template: '<a href="#" id="tab-focus-link1">a</a>' +
                    '<a href="#" id="tab-focus-link2">b</a>' +
                    '<a href="#" id="tab-focus-link3">c</a>' +
                    '<button id="tab-focus-button">Open me!</button>'
            });
            rootScope.$digest();
            expect(documentService).toHaveModalsOpen(1);

            $("#tab-focus-link1").focus();
            expect(document.activeElement.getAttribute("id")).toBe("tab-focus-link1");

            $("#tab-focus-button").css("display", "none");
            triggerKeyDown(angular.element(document.activeElement), 9, true);
            expect(document.activeElement.getAttribute("id")).toBe("tab-focus-link3");

            initialPage.remove();
        });

        it("should change focus to next tabbable element when tab is pressed", () => {
            const initialPage = angular.element('<a href="#" id="cannot-get-focus-from-modal">Outland link</a>');
            angular.element(document.body).append(initialPage);
            initialPage.focus();

            open({
                keyboard: false,
                template: '<button id="tab-focus-button1" tabindex="-1">Skip me!</button>' +
                    '<a href="#" id="tab-focus-link1">a</a>' +
                    '<a href="#" id="tab-focus-link2">b</a><a href="#" id="tab-focus-link3">c</a>' +
                    '<button id="tab-focus-button2" tabindex="-1">Skip me!</button>'
            });
            rootScope.$digest();
            expect(documentService).toHaveModalsOpen(1);

            $("#tab-focus-link3").focus();
            expect(document.activeElement.getAttribute("id")).toBe("tab-focus-link3");

            triggerKeyDown(angular.element(document.activeElement), 9, false);
            expect(document.activeElement.getAttribute("id")).toBe("tab-focus-link1");

            initialPage.remove();
        });

        it("should change focus to previous tabbable element when shift+tab is pressed", () => {
            const initialPage = angular.element('<a href="#" id="cannot-get-focus-from-modal">Outland link</a>');
            angular.element(document.body).append(initialPage);
            initialPage.focus();

            open({
                keyboard: false,
                template: '<button id="tab-focus-button1" tabindex="-1">Skip me!</button>' +
                    '<a href="#" id="tab-focus-link1">a</a>' +
                    '<a href="#" id="tab-focus-link2">b</a><a href="#" id="tab-focus-link3">c</a>' +
                    '<button id="tab-focus-button2" tabindex="-1">Skip me!</button>'
            });
            rootScope.$digest();
            expect(documentService).toHaveModalsOpen(1);

            $("#tab-focus-link1").focus();
            expect(document.activeElement.getAttribute("id")).toBe("tab-focus-link1");

            triggerKeyDown(angular.element(document.activeElement), 9, true);
            expect(document.activeElement.getAttribute("id")).toBe("tab-focus-link3");

            initialPage.remove();
        });
    });

    describe("option by option", () => {
        describe("component", () => {
            function getModalComponent($document) {
                return $document.find("body > div.modal > div.modal-dialog > div.modal-content foo-bar");
            }

            it("should use as modal content", () => {
                open({
                    component: "fooBar"
                });

                const component = getModalComponent(documentService);
                expect(component.html()).toBe("<div>Foo Bar</div>");
            });

            it("should bind expected values", () => {
                const modal = open({
                    component: "fooBar",
                    resolve: {
                        foo() {
                            return "bar";
                        }
                    }
                });

                const component = getModalComponent(documentService);
                const componentScope = component.isolateScope();

                expect(componentScope.foobar.resolve.foo).toBe("bar");
                expect(componentScope.foobar.modalInstance).toBe(modal);
                expect(componentScope.foobar.close).toEqual(jasmine.any(Function));
                expect(componentScope.foobar.dismiss).toEqual(jasmine.any(Function));
            });

            it("should close the modal", () => {
                const modal = open({
                    component: "fooBar",
                    resolve: {
                        foo() {
                            return "bar";
                        }
                    }
                });

                const component = getModalComponent(documentService);
                const componentScope = component.isolateScope();

                componentScope.foobar.close({
                    $value: "baz"
                });

                expect(modal.result).toBeResolvedWith("baz");
            });

            it("should dismiss the modal", () => {
                const modal = open({
                    component: "fooBar",
                    resolve: {
                        foo() {
                            return "bar";
                        }
                    }
                });

                const component = getModalComponent(documentService);
                const componentScope = component.isolateScope();

                componentScope.foobar.dismiss({
                    $value: "baz"
                });

                expect(modal.result).toBeRejectedWith("baz");
            });
        });

        describe("downgraded Angular Component", () => {
            function getModalComponent($document) {
                return $document.find("body > div.modal > div.modal-dialog > div.modal-content foo-bar-angular");
            }

            it("should use as modal content", () => {
                open({
                    component: "fooBarAngular"
                });

                const component = getModalComponent(documentService);
                expect(component.html()).toBe("<div>Foo Angular Bar</div>");
            });

            it("should bind expected values", () => {
                const modal = open({
                    component: "fooBarAngular",
                    downgradedComponent: true,
                    resolve: {
                        foo() {
                            return "bar";
                        }
                    }
                }) as IModalSettings;

                const component = getModalComponent(documentService);
                const componentScope = component.isolateScope();

                const scope = componentScope.foobar;

                expect(scope["[resolve]"].foo).toBe("bar");
                expect(scope["[modalInstance]"]).toBe(modal);
                expect(scope["(close)"]).toEqual(jasmine.any(Function));
                expect(scope["(dismiss)"]).toEqual(jasmine.any(Function));
            });
        });

        describe("template and templateUrl", () => {
            it("should throw an error if none of component, template and templateUrl are provided", () => {
                expect(() => {
                    open({});
                }).toThrow(new Error("One of component or template or templateUrl options is required."));
            });

            it("should not fail if a templateUrl contains leading / trailing white spaces", () => {
                templateCache.put("whitespace.html", "  <div>Whitespaces</div>  ");
                open({ templateUrl: "whitespace.html" });
                expect(documentService).toHaveModalOpenWithContent("Whitespaces", "div");
            });

            it("should accept template as a function", () => {
                open({
                    template() {
                        return "<div>From a function</div>";
                    }
                });

                expect(documentService).toHaveModalOpenWithContent("From a function", "div");
            });

            it("should not fail if a templateUrl as a function", () => {

                templateCache.put("whitespace.html", "  <div>Whitespaces</div>  ");
                open({
                    templateUrl() {
                        return "whitespace.html";
                    }
                });
                expect(documentService).toHaveModalOpenWithContent("Whitespaces", "div");
            });
        });

        describe("controller", () => {
            it("should accept controllers and inject modal instances", () => {
                const TestCtrl = ($scope: any, $uibModalInstance: IModalInstanceService) => {
                    $scope.fromCtrl = "Content from ctrl";
                    $scope.isModalInstance =
                        angular.isObject($uibModalInstance) && angular.isFunction($uibModalInstance.close);
                };

                open({ template: "<div>{{fromCtrl}} {{isModalInstance}}</div>", controller: TestCtrl });
                expect(documentService).toHaveModalOpenWithContent("Content from ctrl true", "div");
            });

            it("should accept controllerAs alias", () => {
                controllerProvider.register("TestCtrl", ($uibModalInstance) => {
                    return {
                        fromCtrl: "Content from ctrl",
                        isModalInstance:
                            angular.isObject($uibModalInstance) &&
                            angular.isFunction($uibModalInstance.close)
                    };
                });

                open({
                    controller: "TestCtrl as test",
                    template: "<div>{{test.fromCtrl}} {{test.isModalInstance}}</div>"
                });
                expect(documentService).toHaveModalOpenWithContent("Content from ctrl true", "div");
            });

            it("should respect the controllerAs property as an alternative for the controller-as syntax", () => {
                controllerProvider.register("TestCtrl", ($uibModalInstance) => {
                    return {
                        fromCtrl: "Content from ctrl",
                        isModalInstance:
                            angular.isObject($uibModalInstance) &&
                            angular.isFunction($uibModalInstance.close)
                    };
                });

                open({
                    controller: "TestCtrl",
                    controllerAs: "test",
                    template: "<div>{{test.fromCtrl}} {{test.isModalInstance}}</div>"
                });
                expect(documentService).toHaveModalOpenWithContent("Content from ctrl true", "div");
            });

            it("should allow defining in-place controller-as controllers", () => {
                open({
                    controller: ($uibModalInstance) => {
                        return {
                            fromCtrl: "Content from ctrl",
                            isModalInstance:
                                angular.isObject($uibModalInstance) &&
                                angular.isFunction($uibModalInstance.close)
                        };
                    },
                    controllerAs: "test",
                    template: "<div>{{test.fromCtrl}} {{test.isModalInstance}}</div>",
                });
                expect(documentService).toHaveModalOpenWithContent("Content from ctrl true", "div");
            });

            it("should allow usage of bindToController", () => {
                const $scope = rootScope.$new(true) as any;
                $scope.foo = "bar";
                open({
                    bindToController: true,
                    controller: ($uibModalInstance) => {
                        return {
                            closeDismissPresent: () => true,
                            foo: $scope.foo,
                            fromCtrl: "Content from ctrl"
                        };
                    },
                    controllerAs: "test",
                    scope: $scope,
                    template: "<div>{{test.fromCtrl}} {{test.closeDismissPresent()}} {{test.foo}}</div>",
                });
                expect(documentService).toHaveModalOpenWithContent("Content from ctrl true bar", "div");
            });

            it("should have $onInit called", () => {
                const $scope = rootScope.$new(true) as any;
                const $onInit = jasmine.createSpy("$onInit");
                $scope.foo = "bar";
                open({
                    bindToController: true,
                    controller($uibModalInstance) {
                        this.$onInit = $onInit;
                        this.fromCtrl = "Content from ctrl";
                        this.closeDismissPresent = () => {
                            return angular.isFunction(this.$close) && angular.isFunction(this.$dismiss);
                        };
                    },
                    controllerAs: "test",
                    scope: $scope,
                    template: "<div>{{test.fromCtrl}} {{test.closeDismissPresent()}} {{test.foo}}</div>",
                });
                expect(documentService).toHaveModalOpenWithContent("Content from ctrl true bar", "div");
                expect($onInit).toHaveBeenCalled();
            });
        });

        describe("resolve", () => {
            const ExposeCtrl = ($scope, value) => {
                $scope.value = value;
            };

            function modalDefinition(template, resolve) {
                return {
                    controller: ExposeCtrl,
                    resolve,
                    template
                };
            }

            it("should resolve simple values", () => {
                open(modalDefinition("<div>{{value}}</div>", {
                    value() {
                        return "Content from resolve";
                    }
                }));

                expect(documentService).toHaveModalOpenWithContent("Content from resolve", "div");
            });

            it("should resolve string references to injectables", () => {
                open({
                    controller($scope, $foo) {
                        $scope.value = "Content from resolve";
                        expect($foo).toBe(serviceToTest);
                    },
                    resolve: {
                        $foo: "$uiLibModal"
                    },
                    template: "<div>{{value}}</div>"
                });

                expect(documentService).toHaveModalOpenWithContent("Content from resolve", "div");
            });

            it("should resolve promises as promises", () => {
                open({
                    controller($scope, $foo) {
                        $scope.value = "Content from resolve";
                        expect($foo).toBe("bar");
                    },
                    resolve: {
                        $foo: q.when("bar")
                    },
                    template: "<div>{{value}}</div>"
                });
            });

            it("should delay showing modal if one of the resolves is a promise", () => {
                open(modalDefinition("<div>{{value}}</div>", {
                    value() {
                        return timeout(() => {
                            return "Promise";
                        }, 100);
                    }
                }), true);
                expect(documentService).toHaveModalsOpen(0);

                timeout.flush();
                expect(documentService).toHaveModalOpenWithContent("Promise", "div");
            });

            it("should not open dialog (and reject returned promise) if one of resolve fails", () => {
                const deferred = q.defer();

                const modal = open(modalDefinition("<div>{{value}}</div>", {
                    value() {
                        return deferred.promise;
                    }
                }), true);
                expect(documentService).toHaveModalsOpen(0);

                deferred.reject("error in test");
                rootScope.$digest();

                expect(documentService).toHaveModalsOpen(0);
                expect(modal.result).toBeRejectedWith("error in test");
            });

            it("should support injection with minification-safe syntax in resolve functions", () => {
                open(modalDefinition("<div>{{value.id}}</div>", {
                    value: ["$locale", (e) => {
                        return e;
                    }]
                }));

                expect(documentService).toHaveModalOpenWithContent("en-us", "div");
            });
        });

        describe("scope", () => {
            it("should use custom scope if provided", () => {
                const $scope = rootScope.$new() as any;
                $scope.fromScope = "Content from custom scope";
                open({
                    scope: $scope,
                    template: "<div>{{fromScope}}</div>"
                });
                expect(documentService).toHaveModalOpenWithContent("Content from custom scope", "div");
            });

            it("should create and use child of $rootScope if custom scope not provided", () => {
                const $rootScope = rootScope as any;
                const scopeTailBefore = $rootScope.$$childTail;

                $rootScope.fromScope = "Content from root scope";
                open({
                    template: "<div>{{fromScope}}</div>"
                });
                expect(documentService).toHaveModalOpenWithContent("Content from root scope", "div");
            });

            it("should expose $resolve in template", () => {
                open({
                    controller($scope) { angular.noop(); },
                    resolve: {
                        $foo() {
                            return "Content from resolve";
                        }
                    },
                    template: "<div>{{$resolve.$foo}}</div>"
                });

                expect(documentService).toHaveModalOpenWithContent("Content from resolve", "div");
            });
        });

        describe("keyboard", () => {
            it("should not close modals if keyboard option is set to false", () => {
                open({
                    keyboard: false,
                    template: "<div>No keyboard</div>"
                });

                expect(documentService).toHaveModalsOpen(1);

                triggerKeyDown(documentService, 27);
                rootScope.$digest();

                expect(documentService).toHaveModalsOpen(1);
            });
        });

        describe("backdrop", () => {
            it("should not have any backdrop element if backdrop set to false", () => {
                const modal = open({
                    backdrop: false,
                    template: "<div>No backdrop</div>"
                });
                expect(documentService).toHaveModalOpenWithContent("No backdrop", "div");
                expect(documentService).not.toHaveBackdrop();

                dismiss(modal);
                expect(documentService).toHaveModalsOpen(0);
            });

            it('should not close modal on backdrop click if backdrop is specified as "static"', () => {
                open({
                    backdrop: "static",
                    template: "<div>Static backdrop</div>"
                });

                documentService.find("body > div.modal-backdrop").click();
                rootScope.$digest();

                expect(documentService).toHaveModalOpenWithContent("Static backdrop", "div");
                expect(documentService).toHaveBackdrop();
            });

            it("should contain backdrop in classes on each modal opening", () => {
                let modal = open({ template: "<div>With backdrop</div>" });
                let backdropEl = documentService.find("body > div.modal-backdrop").get(0);
                expect(backdropEl).toHaveClass("in");

                dismiss(modal);

                modal = open({ template: "<div>With backdrop</div>" });
                backdropEl = documentService.find("body > div.modal-backdrop").get(0);
                expect(backdropEl).toHaveClass("in");

            });

            describe("custom backdrop classes", () => {
                it("should support additional backdrop class as string", () => {
                    open({
                        backdropClass: "additional",
                        template: "<div>With custom backdrop class</div>"
                    });

                    expect(documentService.find("div.modal-backdrop").get(0)).toHaveClass("additional");
                });
            });
        });

        describe("custom window classes", () => {
            it("should support additional window class as string", () => {
                open({
                    template: "<div>With custom window class</div>",
                    windowClass: "additional"
                });

                expect(documentService.find("div.modal").get(0)).toHaveClass("additional");
            });
        });

        describe("top window class", () => {
            it("should support top class option", () => {
                open({
                    template: "<div>With custom window top class</div>",
                    windowTopClass: "top-class"
                });

                expect(documentService.find("div.modal").get(0)).toHaveClass("top-class");
            });
        });

        describe("size", () => {
            it("should support creating small modal dialogs", () => {
                open({
                    size: "sm",
                    template: "<div>Small modal dialog</div>"
                });

                expect(documentService.find("div.modal-dialog").get(0)).toHaveClass("modal-sm");
            });

            it("should support creating large modal dialogs", () => {
                open({
                    size: "lg",
                    template: "<div>Large modal dialog</div>"
                });

                expect(documentService.find("div.modal-dialog").get(0)).toHaveClass("modal-lg");
            });

            it("should support custom size modal dialogs", () => {
                open({
                    size: "custom",
                    template: "<div>Large modal dialog</div>"
                });

                expect(documentService.find("div.modal-dialog").get(0)).toHaveClass("modal-custom");
            });
        });

        describe("animation", () => {
            it("should have animation fade classes by default", () => {
                open({
                    template: "<div>Small modal dialog</div>"
                });

                expect(documentService.find(".modal").get(0)).toHaveClass("fade");
                expect(documentService.find(".modal-backdrop").get(0)).toHaveClass("fade");
            });

            it("should not have fade classes if animation false", () => {
                open({
                    animation: false,
                    template: "<div>Small modal dialog</div>"
                });

                expect(documentService.find(".modal").get(0)).not.toHaveClass("fade");
                expect(documentService.find(".modal-backdrop").get(0)).not.toHaveClass("fade");
            });
        });

        describe("appendTo", () => {
            it("should be added to body by default", () => {
                const modal = open({ template: "<div>Content</div>" });

                expect(documentService).toHaveModalsOpen(1);
                expect(documentService).toHaveModalOpenWithContent("Content", "div");
            });

            it("should not be added to body if appendTo is passed", () => {
                const element = angular.element("<section>Some content</section>");
                angular.element(document.body).append(element);

                const modal = open({ template: "<div>Content</div>", appendTo: element });

                expect(documentService).not.toHaveModalOpenWithContent("Content", "div");

                element.remove();
            });

            it("should be added to appendTo element if appendTo is passed", () => {
                const element = angular.element("<section>Some content</section>");
                angular.element(document.body).append(element);

                expect(documentService.find("section").children("div.modal").length).toBe(0);
                open({ template: "<div>Content</div>", appendTo: element });
                expect(documentService.find("section").children("div.modal").length).toBe(1);

                element.remove();
            });

            it("should throw error if appendTo element is not found", () => {
                expect(() => {
                    open({ template: "<div>Content</div>", appendTo: documentService.find("aside") });
                }).toThrow(new Error("appendTo element not found. Make sure that the element passed is in DOM."));
            });

            it("should be removed from appendTo element when dismissed", () => {
                const modal = open({ template: "<div>Content</div>" });

                expect(documentService).toHaveModalsOpen(1);

                dismiss(modal);
                expect(documentService).toHaveModalsOpen(0);
            });

            it("should allow requiring parent directive from appendTo target", () => {
                const element = compile("<section parent-directive>Some content</section>")(rootScope);
                angular.element(document.body).append(element);

                open({ template: "<div child-directive>{{text}}</div>", appendTo: element });
                expect(documentService.find("[child-directive]").text()).toBe("foo");

                element.remove();
            });
        });

        describe("openedClass", () => {
            let body;

            beforeEach(() => {
                body = documentService.find("body").get(0);
            });

            it("should add the modal-open class to the body element by default", () => {
                open({
                    template: "<div>dummy modal</div>"
                });

                expect(body).toHaveClass("modal-open");
            });

            it("should add the custom class to the body element", () => {
                open({
                    openedClass: "foo",
                    template: "<div>dummy modal</div>"
                });

                expect(body).toHaveClass("foo");
                expect(body).not.toHaveClass("modal-open");
            });

            it("should remove the custom class on closing of modal after animations have completed", () => {
                const modal = open({
                    openedClass: "foo",
                    template: "<div>dummy modal</div>",
                });

                expect(body).toHaveClass("foo");

                close(modal, null, true);
                expect(body).toHaveClass("foo");

                animate.flush();
                rootScope.$digest();
                animate.flush();
                rootScope.$digest();

                expect(body).not.toHaveClass("foo");
            });

            it("should add multiple custom classes to the body element and remove appropriately", () => {
                const modal1 = open({
                    openedClass: "foo",
                    template: "<div>dummy modal</div>"
                });

                expect(body).toHaveClass("foo");
                expect(body).not.toHaveClass("modal-open");

                const modal2 = open({
                    openedClass: "bar",
                    template: "<div>dummy modal</div>"
                });

                expect(body).toHaveClass("foo");
                expect(body).toHaveClass("bar");
                expect(body).not.toHaveClass("modal-open");

                const modal3 = open({
                    openedClass: "foo",
                    template: "<div>dummy modal</div>"
                });

                expect(body).toHaveClass("foo");
                expect(body).toHaveClass("bar");
                expect(body).not.toHaveClass("modal-open");

                close(modal1);

                expect(body).toHaveClass("foo");
                expect(body).toHaveClass("bar");
                expect(body).not.toHaveClass("modal-open");

                close(modal2);

                expect(body).toHaveClass("foo");
                expect(body).not.toHaveClass("bar");
                expect(body).not.toHaveClass("modal-open");

                close(modal3);

                expect(body).not.toHaveClass("foo");
                expect(body).not.toHaveClass("bar");
                expect(body).not.toHaveClass("modal-open");
            });

            it("should not add the modal-open class if modal is closed before animation", () => {
                const modal = open({
                    template: "<div>dummy modal</div>"
                }, true);

                close(modal);

                expect(body).not.toHaveClass("modal-open");
            });
        });

        describe("ariaLabelledBy", () => {
            it("should add the aria-labelledby property to the modal", () => {
                open({
                    ariaLabelledBy: "modal-label",
                    template: '<div><h3 id="modal-label">Modal Label</h3>' +
                        '<p id="modal-description">Modal description</p></div>'
                });

                expect(documentService.find(".modal").attr("aria-labelledby")).toEqual("modal-label");
            });
        });

        describe("ariaDescribedBy", () => {
            it("should add the aria-describedby property to the modal", () => {
                open({
                    ariaDescribedBy: "modal-description",
                    template: '<div><h3 id="modal-label">Modal Label</h3>' +
                        '<p id="modal-description">Modal description</p></div>'
                });

                expect(documentService.find(".modal").attr("aria-describedby")).toEqual("modal-description");
            });
        });
    });

    describe("modal window", () => {
        it("should not use transclusion scope for modals content - issue 2110", () => {
            const $rootScope = rootScope as any;
            $rootScope.animate = false;
            compile('<div uib-modal-window animate="animate"><span ng-init="foo=true"></span></div>')($rootScope);
            $rootScope.$digest();

            expect($rootScope.foo).toBeTruthy();
        });

        it("should support window top class", () => {
            const $rootScope = rootScope as any;
            $rootScope.animate = false;
            const windowEl = compile(
                '<div uib-modal-window animate="animate" window-top-class="test foo">content</div>')($rootScope).get(0);
            $rootScope.$digest();

            expect(windowEl).toHaveClass("test");
            expect(windowEl).toHaveClass("foo");
        });

        it("should support custom template url", () => {
            templateCache.put("window.html", "<div ng-transclude></div>");

            const windowEl = compile('<div uib-modal-window template-url="window.html">content</div>')(rootScope);
            rootScope.$digest();

            expect(windowEl.html()).toBe('<div ng-transclude="">content</div>');
        });
    });

    describe("multiple modals", () => {
        it("should allow opening of multiple modals", () => {
            const modal1 = open({ template: "<div>Modal1</div>" });
            const modal2 = open({ template: "<div>Modal2</div>" });
            expect(documentService).toHaveModalsOpen(2);

            dismiss(modal2);
            expect(documentService).toHaveModalsOpen(1);
            expect(documentService).toHaveModalOpenWithContent("Modal1", "div");

            dismiss(modal1);
            expect(documentService).toHaveModalsOpen(0);
        });

        it("should be able to dismiss all modals at once", () => {
            const modal1 = open({ template: "<div>Modal1</div>" });
            const modal2 = open({ template: "<div>Modal2</div>" });
            expect(documentService).toHaveModalsOpen(2);

            uibModalStack.dismissAll();
            animate.flush();
            animate.flush();
            expect(documentService).toHaveModalsOpen(0);
        });

        it("should not close any modals on ESC if the topmost one does not allow it", () => {
            const modal1 = open({ template: "<div>Modal1</div>" });
            const modal2 = open({ template: "<div>Modal2</div>", keyboard: false });

            triggerKeyDown(documentService, 27);
            rootScope.$digest();

            expect(documentService).toHaveModalsOpen(2);
        });

        it("should not close any modals on click if a topmost modal does not have backdrop", () => {
            const modal1 = open({ template: "<div>Modal1</div>" });
            const modal2 = open({ template: "<div>Modal2</div>", backdrop: false });

            documentService.find("body > div.modal-backdrop").click();
            rootScope.$digest();

            expect(documentService).toHaveModalsOpen(2);
        });

        it("should not interfere with default options", () => {
            const modal1 = open({ template: "<div>Modal1</div>", backdrop: false });
            const modal2 = open({ template: "<div>Modal2</div>" });
            rootScope.$digest();

            expect(documentService).toHaveBackdrop();
        });

        it('should add "modal-open" class when a modal gets opened', () => {
            const body = documentService.find("body").get(0);
            expect(body).not.toHaveClass("modal-open");

            const modal1 = open({ template: "<div>Content1</div>" });
            expect(body).toHaveClass("modal-open");

            const modal2 = open({ template: "<div>Content1</div>" });
            expect(body).toHaveClass("modal-open");

            dismiss(modal1);
            expect(body).toHaveClass("modal-open");

            dismiss(modal2);
            expect(body).not.toHaveClass("modal-open");
        });

        it("should return to the element which had focus before the dialog is invoked", () => {
            const link = "<a href>Link</a>";
            const element = angular.element(link);
            angular.element(document.body).append(element);
            element.focus();
            expect(document.activeElement.tagName).toBe("A");

            const modal1 = open({ template: '<div>Modal1<button id="focus">inside modal1</button></div>' });
            rootScope.$digest();
            document.getElementById("focus").focus();
            expect(document.activeElement.tagName).toBe("BUTTON");
            expect(documentService).toHaveModalsOpen(1);

            const modal2 = open({ template: "<div>Modal2</div>" });
            rootScope.$digest();
            expect(document.activeElement.tagName).toBe("DIV");
            expect(documentService).toHaveModalsOpen(2);

            dismiss(modal2);
            expect(document.activeElement.tagName).toBe("BUTTON");
            expect(documentService).toHaveModalsOpen(1);

            dismiss(modal1);
            expect(document.activeElement.tagName).toBe("A");
            expect(documentService).toHaveModalsOpen(0);

            element.remove();
        });

        it("should open modals and resolve the opened promises in order", () => {
            // Opens a modal for each element in array order.
            // Order is an array of non-repeating integers from 0..length-1
            // representing when to resolve that modal's promise.
            // For example [1,2,0] would resolve the 3rd modal's promise first and the 2nd modal's promise last.
            // Tests that the modals are added to $uibModalStack and that
            // each resolves its "opened" promise sequentially.
            // If an element is {reject:n} then n is still the order, but the corresponding promise is rejected.
            // A rejection earlier in the open sequence should not affect modals opened later.
            function test(order) {
                const ds = []; // {index, deferred, reject}
                let expected = ""; // 0..length-1
                let actual = "";
                angular.forEach(order, (x, i) => {
                    const reject = x.reject !== undefined;
                    if (reject) {
                        x = x.reject;
                    } else {
                        expected += i;
                    }
                    ds[x] = { index: i, deferred: q.defer(), reject };

                    const scope = rootScope.$new() as any;
                    let failed = false;
                    scope.index = i;
                    open({
                        resolve: {
                            x() {
                                return ds[x].deferred.promise.catch(() => {
                                    failed = true;
                                });
                            }
                        },
                        scope,
                        template: "<div>" + i + "</div>"
                    }, true).opened.then(() => {
                        expect(uibModalStack.getTop().value.modalScope.index).toEqual(i);
                        if (!failed) { actual += i; }
                    });
                });

                angular.forEach(ds, (d, i) => {
                    if (d.reject) {
                        d.deferred.reject("rejected:" + d.index);
                    } else {
                        d.deferred.resolve("resolved:" + d.index);
                    }
                    rootScope.$digest();
                });

                expect(actual).toEqual(expected);
                expect(serviceToTest.getPromiseChain()).toEqual(null);
            }

            // Calls emit n! times on arrays of length n containing
            // all non-repeating permutations of the integers 0..n-1.
            function permute(n, emit) {
                if (n < 1 || typeof emit !== "function") {
                    return;
                }
                const a = [];
                function _permute(depth) {
                    index: for (let i = 0; i < n; i++) {
                        for (let j = 0; j < depth; j++) {
                            if (a[j] === i) {
                                continue index; // already used
                            }
                        }

                        a[depth] = i;
                        if (depth + 1 === n) {
                            emit(angular.copy(a));
                        } else {
                            _permute(depth + 1);
                        }
                    }
                }
                _permute(0);
            }

            permute(2, (a) => {
                test(a);
            });
            permute(2, (a) => {
                test(a.map((x, i) => {
                    return { reject: x };
                }));
            });
            permute(2, (a) => {
                test(a.map((x, i) => {
                    return i === 0 ? { reject: x } : x;
                }));
            });
            permute(3, (a) => {
                test(a);
            });
            permute(3, (a) => {
                test(a.map((x, i) => {
                    return { reject: x };
                }));
            });
            permute(3, (a) => {
                test(a.map((x, i) => {
                    return i === 0 ? { reject: x } : x;
                }));
            });
            permute(3, (a) => {
                test(a.map((x, i) => {
                    return i === 1 ? { reject: x } : x;
                }));
            });

            animate.flush();
        });

        it("should have top class only on top window", () => {
            open({
                template: "<div>Content1</div>",
                windowClass: "modal1",
                windowTopClass: "modal-top"
            });
            expect(documentService.find("div.modal1").get(0)).toHaveClass("modal-top");
            expect(documentService).toHaveModalsOpen(1);

            const modal2 = open({
                template: "<div>Content1</div>",
                windowClass: "modal2",
                windowTopClass: "modal-top"
            });
            expect(documentService.find("div.modal1").get(0)).not.toHaveClass("modal-top");
            expect(documentService.find("div.modal2").get(0)).toHaveClass("modal-top");
            expect(documentService).toHaveModalsOpen(2);

            const modal3 = open({
                template: "<div>Content1</div>",
                windowClass: "modal3",
                windowTopClass: "modal-top"
            });
            expect(documentService.find("div.modal1").get(0)).not.toHaveClass("modal-top");
            expect(documentService.find("div.modal2").get(0)).not.toHaveClass("modal-top");
            expect(documentService.find("div.modal3").get(0)).toHaveClass("modal-top");
            expect(documentService).toHaveModalsOpen(3);

            dismiss(modal2);
            expect(documentService.find("div.modal1").get(0)).not.toHaveClass("modal-top");
            expect(documentService.find("div.modal3").get(0)).toHaveClass("modal-top");
            expect(documentService).toHaveModalsOpen(2);

            close(modal3);
            expect(documentService.find("div.modal1").get(0)).toHaveClass("modal-top");
            expect(documentService).toHaveModalsOpen(1);
        });

        xit("should have top modal with highest index", () => {
            let modal2Index = null;
            let modal3Index = null;

            const modal1Instance = {
                closed: q.defer(),
                opened: q.defer(),
                close(result) {
                    return uibModalStack.close(modal1Instance as any, result);
                },
                dismiss(reason) {
                    return uibModalStack.dismiss(modal1Instance as any, reason);
                },
                rendered: q.defer()
            };
            const modal2Instance = {
                closed: q.defer(),
                close(result) {
                    return uibModalStack.close(modal2Instance as any, result);
                },
                dismiss(reason) {
                    return uibModalStack.dismiss(modal2Instance as any, reason);
                },
                opened: q.defer(),
                rendered: q.defer(),
                result: q.defer()
            };
            const modal3Instance = {
                closed: q.defer(),
                close(result) {
                    return uibModalStack.close(modal3Instance as any, result);
                },
                dismiss(reason) {
                    return uibModalStack.dismiss(modal3Instance as any, reason);
                },
                opened: q.defer(),
                rendered: q.defer(),
                result: q.defer()
            };

            uibModalStack.open(modal1Instance as any, {
                appendTo: angular.element(document.body),
                closedDeferred: modal1Instance.closed,
                content: "<div>Modal1</div>",
                deferred: (modal1Instance as any).result,
                renderDeferred: modal1Instance.rendered,
                scope: rootScope.$new()
            });

            rootScope.$digest();
            animate.flush();
            expect(documentService).toHaveModalsOpen(1);

            expect(parseInt(uibModalStack.getTop().value.modalDomEl.attr("index"), 10)).toEqual(0);

            uibModalStack.open(modal2Instance as any, {
                appendTo: angular.element(document.body),
                closedDeferred: modal2Instance.closed,
                content: "<div>Modal2</div>",
                deferred: modal2Instance.result,
                renderDeferred: modal2Instance.rendered,
                scope: rootScope.$new()
            });

            modal2Instance.rendered.promise.then(() => {
                modal2Index = parseInt(uibModalStack.getTop().value.modalDomEl.attr("index"), 10);
            });

            rootScope.$digest();
            animate.flush();
            expect(documentService).toHaveModalsOpen(2);

            expect(modal2Index).toEqual(1);
            close(modal1Instance as any);
            expect(documentService).toHaveModalsOpen(1);

            uibModalStack.open(modal3Instance as any, {
                appendTo: angular.element(document.body),
                closedDeferred: modal3Instance.closed,
                content: "<div>Modal3</div>",
                deferred: modal3Instance.result,
                renderDeferred: modal3Instance.rendered,
                scope: rootScope.$new()
            });

            modal3Instance.rendered.promise.then(() => {
                modal3Index = parseInt(uibModalStack.getTop().value.modalDomEl.attr("index"), 10);
            });

            rootScope.$digest();
            animate.flush();
            expect(documentService).toHaveModalsOpen(2);

            expect(modal3Index).toEqual(2);
            expect(modal2Index).toBeLessThan(modal3Index);
        });

        xit("should have top modal with highest z-index", () => {
            let modal2zIndex = null;
            let modal3zIndex = null;

            const modal1Instance = {
                close(result) {
                    return uibModalStack.close(modal1Instance as any, result);
                },
                closed: q.defer(),
                dismiss(reason) {
                    return uibModalStack.dismiss(modal1Instance as any, reason);
                },
                opened: q.defer(),
                rendered: q.defer(),
                result: q.defer()
            };
            const modal2Instance = {
                close(result) {
                    return uibModalStack.close(modal2Instance as any, result);
                },
                closed: q.defer(),
                dismiss(reason) {
                    return uibModalStack.dismiss(modal2Instance as any, reason);
                },
                opened: q.defer(),
                rendered: q.defer(),
                result: q.defer()
            };
            const modal3Instance = {
                close(result) {
                    return uibModalStack.close(modal3Instance as any, result);
                },
                closed: q.defer(),
                dismiss(reason) {
                    return uibModalStack.dismiss(modal3Instance as any, reason);
                },
                opened: q.defer(),
                rendered: q.defer(),
                result: q.defer()
            };

            uibModalStack.open(modal1Instance as any, {
                appendTo: angular.element(document.body),
                closedDeferred: modal1Instance.closed,
                content: "<div>Modal1</div>",
                deferred: modal1Instance.result,
                renderDeferred: modal1Instance.rendered,
                scope: rootScope.$new()
            });

            rootScope.$digest();
            animate.flush();
            expect(documentService).toHaveModalsOpen(1);

            expect(+uibModalStack.getTop().value.modalDomEl[0].style.zIndex).toBe(1050);

            uibModalStack.open(modal2Instance as any, {
                appendTo: angular.element(document.body),
                closedDeferred: modal2Instance.closed,
                content: "<div>Modal2</div>",
                deferred: modal2Instance.result,
                renderDeferred: modal2Instance.rendered,
                scope: rootScope.$new()
            });

            modal2Instance.rendered.promise.then(() => {
                modal2zIndex = +uibModalStack.getTop().value.modalDomEl[0].style.zIndex;
            });

            rootScope.$digest();
            animate.flush();
            expect(documentService).toHaveModalsOpen(2);

            expect(modal2zIndex).toBe(1060);
            close(modal1Instance as any);
            expect(documentService).toHaveModalsOpen(1);

            uibModalStack.open(modal3Instance as any, {
                appendTo: angular.element(document.body),
                closedDeferred: modal3Instance.closed,
                content: "<div>Modal3</div>",
                deferred: modal3Instance.result,
                renderDeferred: modal3Instance.rendered,
                scope: rootScope.$new()
            });

            modal3Instance.rendered.promise.then(() => {
                modal3zIndex = +uibModalStack.getTop().value.modalDomEl[0].style.zIndex;
            });

            rootScope.$digest();
            animate.flush();
            expect(documentService).toHaveModalsOpen(2);

            expect(modal3zIndex).toBe(1070);
            expect(modal2zIndex).toBeLessThan(modal3zIndex);
        });
    });

    describe("modal.closing event", () => {
        it("should close the modal contingent on the modal.closing " +
           "event and return whether the modal closed", () => {
            let preventDefault;
            let modal;
            const template = "<div>content</div>";

            function TestCtrl($scope) {
                $scope.$on("modal.closing", (event, resultOrReason, closing) => {
                    if (preventDefault) {
                        event.preventDefault();
                    }
                });
            }

            modal = open({ template, controller: TestCtrl });

            preventDefault = true;
            expect(close(modal, "result", true)).toBeFalsy();
            expect(documentService).toHaveModalsOpen(1);

            preventDefault = false;
            expect(close(modal, "result")).toBeTruthy();
            expect(documentService).toHaveModalsOpen(0);

            modal = open({ template, controller: TestCtrl });

            preventDefault = true;
            expect(dismiss(modal, "result", true)).toBeFalsy();
            expect(documentService).toHaveModalsOpen(1);

            preventDefault = false;
            expect(dismiss(modal, "result")).toBeTruthy();
            expect(documentService).toHaveModalsOpen(0);
        });

        it("should trigger modal.closing and pass result/reason and closing parameters to the event", () => {
            let called;

            called = false;

            close(open({
                template: "<div>content</div>",
                controller($scope) {
                    $scope.$on("modal.closing", (event, resultOrReason, closing) => {
                        called = true;
                        expect(resultOrReason).toBe("result");
                        expect(closing).toBeTruthy();
                    });
                }
            }), "result");
            expect(called).toBeTruthy();

            called = false;
            dismiss(open({
                template: "<div>content</div>",
                controller($scope) {
                    $scope.$on("modal.closing", (event, resultOrReason, closing) => {
                        called = true;
                        expect(resultOrReason).toBe("reason");
                        expect(closing).toBeFalsy();
                    });
                }
            }), "reason");
            expect(called).toBeTruthy();
        });
    });
});
