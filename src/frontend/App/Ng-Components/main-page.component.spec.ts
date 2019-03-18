import { APP_BASE_HREF } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { StateService, UIRouterModule } from "@uirouter/angular";
import { Observable, of, Subject } from "rxjs";
import { EModals } from ".";
import { IDevice } from "../../../common/rest";
import { ModalManagerService, UserInterfaceLibModule } from "../Ng-Ui-Lib";
import { AppServicesModule } from "../Services";
import { ApplicationService } from "../Services/application.service";
import { DataService } from "../Services/data.service";
import { ELanguages, IDeviceSelection, ILanguageParam, IMessageParam } from "./definitions";
import { DevicePanelComponent } from "./devicePanel/device-panel.component.ng2";
import { LocalizationService } from "./localization.service";
import { MainPageComponent } from "./main-page.component.ng2";
import { ToolBarComponent } from "./toolBar/toolbar.component.ng2";

describe("Given a main page component", () => {

    const devices: IDevice[] = [{
        id: 1,
        name: "Device 2"
    }];

    let fixture: ComponentFixture<MainPageComponent>;
    let element: Element;
    let component: MainPageComponent;
    let goSpy: jasmine.Spy;
    let setLanguageSpy: jasmine.Spy;
    let deviceNameSpy: jasmine.Spy;
    let addNewDeviceSpy: jasmine.Spy;
    let deleteDeviceMessageSpy: jasmine.Spy;
    let modalPushSpy: jasmine.Spy;
    let deleteDeviceSpy: jasmine.Spy;
    let closeMessageSpy: jasmine.Spy;
    let closeSpy: jasmine.Spy;

    class FakeLoader implements TranslateLoader {
        public getTranslation(lang: string): Observable<any> {
            return of({});
        }
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [
                MainPageComponent,
                ToolBarComponent,
                DevicePanelComponent
            ],
            imports: [
                AppServicesModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader}
                }),
                UIRouterModule.forRoot(),
                UserInterfaceLibModule
            ],
            providers: [
                LocalizationService,
                {
                    provide: APP_BASE_HREF,
                    useValue : "/"
                }
            ]
        });

        fixture = TestBed.createComponent(MainPageComponent);
        element = fixture.nativeElement;
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        const stateService: StateService = TestBed.get(StateService);
        goSpy = spyOn(stateService, "go");
        const dataService: DataService = TestBed.get(DataService);
        spyOnProperty(dataService, "devices", "get").and.returnValue(devices);
        addNewDeviceSpy = spyOn(dataService, "addNewDevice");
        deleteDeviceSpy = spyOn(dataService, "deleteDevice");
        component.selectedDeviceId = devices[0].id;
        const localizationService: LocalizationService = TestBed.get(LocalizationService);
        setLanguageSpy = spyOn(localizationService, "setLanguage");
        deviceNameSpy = spyOnProperty(localizationService, "deviceName", "get");
        deleteDeviceMessageSpy = spyOnProperty(localizationService, "deleteDeviceMessage", "get");
        closeMessageSpy = spyOnProperty(localizationService, "closeMessage", "get");
        const modalManagerService: ModalManagerService = TestBed.get(ModalManagerService);
        modalPushSpy = spyOn(modalManagerService, "push");
        const applicationService: ApplicationService = TestBed.get(ApplicationService);
        closeSpy = spyOn(applicationService, "close");

        fixture.detectChanges();
    });

    it("When it is initialized Then the html is defined", () => {
        expect(element).toBeDefined();
    });

    it("When is ititialized Then it gets the existing devices", () => {
        expect(component.devices).toEqual(devices);
    });

    it("When it is initialized Then it goes to the pages edition", () => {
        const expectedDeviceSelection: IDeviceSelection = { deviceId: component.selectedDeviceId };

        expect(goSpy).toHaveBeenCalledWith("pages", expectedDeviceSelection);
    });

    it("When it is initialized Then it sets the default language", () => {
        expect(setLanguageSpy).toHaveBeenCalledWith(ELanguages.English);
    });

    it("When calling edit devices Then the view changes to the device edition", () => {
        component.selectedDeviceId = devices[0].id;
        const expectedDeviceSelection: IDeviceSelection = { deviceId: component.selectedDeviceId };
        component.editDevices();

        expect(component.editingDevices).toBeTruthy();
        expect(goSpy).toHaveBeenCalledWith("device", expectedDeviceSelection);
    });

    it("When calling edit pages Then the view changes to the pages edition", () => {
        component.selectedDeviceId = devices[0].id;
        const expectedDeviceSelection: IDeviceSelection = { deviceId: component.selectedDeviceId };
        component.editPages();

        expect(component.editingDevices).toBeFalsy();
        expect(goSpy).toHaveBeenCalledWith("pages", expectedDeviceSelection);
    });

    it("When selecting device Then it is reflected by the associated property", () => {
        const ExpectedDeviceId = 5;
        component.selectDevice(ExpectedDeviceId);
        expect(component.selectedDeviceId).toBe(ExpectedDeviceId);
    });

    it("When selecting device Then the view is adjusted with the selected device", () => {
        const ExpectedDeviceId = 8;
        component.editingDevices = true;
        component.selectDevice(ExpectedDeviceId);
        const expectedDeviceSelection: IDeviceSelection = { deviceId: component.selectedDeviceId };

        expect(goSpy).toHaveBeenCalledWith("device", expectedDeviceSelection);
    });

    it("When adding a device Then the data service is called with thee localized name", () => {
        const expectedName = "DEVICE";
        deviceNameSpy.and.returnValue(of(expectedName));

        component.addDevice();

        expect(addNewDeviceSpy).toHaveBeenCalledWith(expectedName);
    });

    it("When deleting a device Then a dialog is open", () => {
        const deleteMessage = "Delete Device";
        deleteDeviceMessageSpy.and.returnValue(of(deleteMessage));
        const expectedDialogMessage: IMessageParam = { message: `${deleteMessage}: ${devices[0].name}` };
        modalPushSpy.and.returnValue(of({}));

        component.deleteDevice(devices[0].id);

        expect(modalPushSpy).toHaveBeenCalledWith(EModals.Confimation, expectedDialogMessage);
    });

    it("When deleting a device dialog is confirmed Then the device is deleted", () => {
        deleteDeviceMessageSpy.and.returnValue(of(""));
        modalPushSpy.and.returnValue(of({}));

        component.deleteDevice(devices[0].id);

        expect(deleteDeviceSpy).toHaveBeenCalledWith(devices[0].id);
    });

    it("When deleting a device dialog is not confirmed Then the device is not deleted", () => {
        deleteDeviceMessageSpy.and.returnValue(of(""));
        const observableMock = new Subject<any>();
        modalPushSpy.and.returnValue(observableMock);

        component.deleteDevice(devices[0].id);
        observableMock.error({});

        expect(deleteDeviceSpy).not.toHaveBeenCalled();
    });

    it("When calling settings Then the settings dialog is open", () => {
        modalPushSpy.and.returnValue(of({}));

        component.settings();

        expect(modalPushSpy).toHaveBeenCalledWith(
            EModals.Settings,
            { language: ELanguages.English } as ILanguageParam);
    });

    it("When calling settings is applied Then the settings dialog returns application settings to be applied", () => {
        const observableMock = new Subject<any>();
        modalPushSpy.and.returnValue(observableMock);
        setLanguageSpy.calls.reset();

        component.settings();
        observableMock.next(ELanguages.Klingon);

        expect(setLanguageSpy).toHaveBeenCalledWith(ELanguages.Klingon);
    });

    it("When calling settings is dismissed Then no settings are applied", () => {
        const observableMock = new Subject<any>();
        modalPushSpy.and.returnValue(observableMock);
        setLanguageSpy.calls.reset();

        component.settings();
        observableMock.error({});

        expect(setLanguageSpy).not.toHaveBeenCalled();
    });

    it("When calling close Then the close confirmation dialog is open", () => {
        modalPushSpy.and.returnValue(of({}));
        const closeMessage = "Close Application";
        closeMessageSpy.and.returnValue(of(closeMessage));
        const expectedDialogMessage: IMessageParam = { message: closeMessage };

        component.close();

        expect(modalPushSpy).toHaveBeenCalledWith(EModals.Confimation, expectedDialogMessage);
    });

    it("When closing app is confirmed then the application is closed", () => {
        modalPushSpy.and.returnValue(of({}));
        closeMessageSpy.and.returnValue(of(""));

        component.close();

        expect(closeSpy).toHaveBeenCalled();
    });

    it("When closing app is not confirmed then the application is not closed", () => {
        const observableMock = new Subject<any>();
        modalPushSpy.and.returnValue(observableMock);
        closeMessageSpy.and.returnValue(of(""));

        component.close();
        observableMock.error({});

        expect(closeSpy).not.toHaveBeenCalled();
    });
});
