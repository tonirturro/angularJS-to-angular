import * as angular from "angular";
import { IQService, IRootScopeService } from "angular";
import { IModalInstanceService, IModalService, IModalSettings } from "../../definitions";
import { ModalManager } from "./modal-manager.service";

describe("Given a Modal Manager", () => {
    const dialogName = "name";
    const dialogSettings: IModalSettings = {};
    const minimumSettings = {
        backdrop: "static",
        keyboard: false,
        size: "sm"
    };
    let service: ModalManager;
    let openModalMock: jasmine.Spy;
    let rootScope: IRootScopeService;
    let dialogInstance: IModalInstanceService;

    beforeEach(angular.mock.module("ui-lib"));

    beforeEach(inject((
        modalManager: ModalManager,
        $uiLibModal: IModalService,
        $q: IQService,
        $rootScope: IRootScopeService) => {
        service = modalManager;
        rootScope = $rootScope;
        const deferred = $q.defer();
        dialogInstance = {
            close: (result?: any) => { deferred.resolve(result); },
            dismiss: (result?: any) => { deferred.reject(result); },
            result: deferred.promise
        } as IModalInstanceService;
        openModalMock = spyOn($uiLibModal, "open");
        openModalMock.and.returnValue(dialogInstance);
    }));

    it("Is instantiated", () => {
        expect(service).toBeDefined();
    });

    describe("And registering dialogs", () => {

        it("When the dialog has not been previously registered Then it succeeds", () => {
            expect(service.register("name", {} as IModalSettings)).toBeTruthy();
        });

        it("When the dialog has been previously registered it fails", () => {
            service.register(dialogName, dialogSettings);
            expect(service.register(dialogName, dialogSettings)).toBeFalsy();
        });
    });

    describe("And pushing a dialog", () => {

        it("When the dialog has not been previously registered Then it fails", () => {
            expect(service.push("name")).toBeFalsy();
        });

        describe("And the dialog has been previously registered", () => {
            beforeEach(() => {
                service.register(dialogName, dialogSettings);
            });

            it("Then it opens a dialog", () => {
                service.push(dialogName);

                expect(openModalMock).toHaveBeenCalled();
            });

            it("Then it opens a dialog", () => {
                service.push(dialogName);

                expect(openModalMock).toHaveBeenCalled();
            });

            it("Then it opens a dialog whit at least the minimum dialog settings", () => {
                const expectedSettings: IModalSettings = {};
                angular.extend(expectedSettings, dialogSettings, minimumSettings);

                service.push(dialogName);

                expect(openModalMock).toHaveBeenCalledWith(expectedSettings);
            });

            it("Then it returns a promise", () => {
                const result = service.push(dialogName);

                expect(result.then).toBeDefined();
            });

            it("When params are pushed Then the dialog is opened with this params", () => {
                const params = {
                    id: 1
                };
                const expectedSettings: IModalSettings = {};
                angular.extend(expectedSettings, dialogSettings, minimumSettings, { resolve: { params } });

                service.push(dialogName, params);

                expect(openModalMock).toHaveBeenCalledWith(expectedSettings);
            });
        });

    });

    describe("And poping one dialog", () => {
        beforeEach(() => {
            service.register(dialogName, dialogSettings);
        });

        xit("When there is no dialog opened Then it fails", () => {
            expect(service.pop()).toBeFalsy();
        });

        xit("When there is a dialog opened Then it succeeds", () => {
            service.push(dialogName);

            expect(service.pop()).toBeTruthy();
        });

        it("When there is a dialog opened Then it closes the dialog", () => {
            const closeMock = spyOn(dialogInstance, "close");
            service.push(dialogName);
            service.pop();

            expect(closeMock).toHaveBeenCalled();
        });
    });

    describe("And replacing a dialog", () => {
        const otherDialog = {
            name: "dialogName",
            settings: {} as IModalSettings
        };

        beforeEach(() => {
            service.register(dialogName, dialogSettings);
            service.push(dialogName);
        });

        it("When the dialog has not been previously registered Then it fails", () => {
            expect(service.replaceTop(otherDialog.name)).toBeFalsy();
        });

        it("When there is a dialog opened Then it closes the dialog", () => {
            const closeMock = spyOn(dialogInstance, "close");
            service.register(otherDialog.name, otherDialog.settings);
            service.replaceTop(otherDialog.name);

            expect(closeMock).toHaveBeenCalled();
        });

        it("When params are send Then the dialog is opened with this params", () => {
            const params = {
                id: 1
            };
            const expectedSettings: IModalSettings = {};
            service.register(otherDialog.name, otherDialog.settings);
            angular.extend(expectedSettings, otherDialog.settings, minimumSettings, { resolve: { params } });

            service.replaceTop(dialogName, params);

            expect(openModalMock).toHaveBeenCalledWith(expectedSettings);
        });
    });

    describe("And closing a dialog", () => {

        beforeEach(() => {
            service.register(dialogName, dialogSettings);
        });

        it("When close Then it returns the close value", (done) => {
            const closeResult = {
                peekaboo: true
            };

            service.push(dialogName).then((result) => {
                expect(result).toEqual(closeResult);
                done();
            });

            dialogInstance.close(closeResult);
            rootScope.$apply();
        });

        it("When dismiss Then it returns the dismissed value", (done) => {
            const dismissResult = "Dialog dismiss";

            service.push(dialogName).then(() => {
                angular.noop();
            },
            (result) => {
                expect(result).toEqual(dismissResult);
                done();
            });

            dialogInstance.dismiss(dismissResult);
            rootScope.$apply();
        });

        it("When closed Then dialog cannot be poped", (done) => {
            service.push(dialogName).then(() => {
                expect(service.pop()).toBeFalsy();
                done();
            });

            dialogInstance.close();
            rootScope.$apply();
        });

        it("When dismiss Then dialog cannot be poped", (done) => {
            service.push(dialogName).then(
                () => { angular.noop(); },
                () => {
                expect(service.pop()).toBeFalsy();
                done();
            });

            dialogInstance.dismiss();
            rootScope.$apply();
        });
    });
});
