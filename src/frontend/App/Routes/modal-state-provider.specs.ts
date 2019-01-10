import { IServiceProvider } from "angular";
import * as angular from "angular";
import { IModalService, IModalSettings } from "../UiLib/definitions";
import { IModalStates } from "./modal-state-provider";

describe("Given a modal state provider", () => {
    let modalStates: IModalStates;
    let modalService: IModalService;

    beforeEach(() => {
        angular.mock.module("myApp.routes", (modalStateProvider: IServiceProvider) => {
            modalStates = modalStateProvider.$get();
        });
    });

    beforeEach(inject(($uiLibModal: IModalService) => {
        modalService = $uiLibModal;
    }));

    it("Then it can be mocked", () => {
        expect(modalStates).toBeDefined();
        expect(angular.isFunction(modalStates.create)).toBeTruthy();
    });

    it("When creating a modal state Then it returs a state definition", () => {
        const stateName = "modal.dialog";
        const expectedStateUrl = "/modal/dialog";
        const modalSettings: IModalSettings = {
            component: "myComponent"
        };
        const modalState = modalStates.create(stateName, modalSettings);

        expect(modalState.name).toBe(stateName);
        expect(modalState.url).toBe(expectedStateUrl);
        expect(angular.isFunction(modalState.onEnter)).toBeTruthy();
        expect(angular.isFunction(modalState.onExit)).toBeTruthy();
    });

    describe("And Given a modal state", () => {
        it("When calling onEnter it opens a modal dialog", () => {
            spyOn(modalService, "open").and.returnValue( {
                result: {
                    finally: () =>  {
                        angular.noop();
                    }
                }
            });
            const modalSettings: IModalSettings = {
                component: "myComponent"
            };
            const modalState = modalStates.create("stateName", modalSettings);
            const enterFunction = modalState.onEnter as (param: any) => void;

            enterFunction(modalService);

            expect(modalService.open).toHaveBeenCalled();
        });
    });
});
