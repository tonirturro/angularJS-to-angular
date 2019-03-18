import { APP_BASE_HREF } from "@angular/common";
import { TestBed } from "@angular/core/testing";
import { UIRouterModule } from "@uirouter/angular";
import { StateService } from "@uirouter/angular";
import { StateWrapperService } from "./state-wrapper.service";

describe("Given a state service wrapper", () => {

    const name = "state.name";
    const params = {
        param: "value"
    };
    let service: StateWrapperService;
    let goSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ UIRouterModule.forRoot()],
            providers: [
                StateWrapperService,
                {
                    provide: APP_BASE_HREF,
                    useValue : "/"
                }
             ]
        });

        service = TestBed.get(StateWrapperService);
        const stateService: StateService = TestBed.get(StateService);
        goSpy = spyOn(stateService, "go");
    });

    it("When calling a the go method with name and params Then they are forwarded", () => {
        service.go(name, params);

        expect(goSpy).toHaveBeenCalledWith(name, params);
    });

    it("When calling a the go method with name only Then parms are undefined", () => {
        service.go(name);

        expect(goSpy).toHaveBeenCalledWith(name, undefined);
    });
});
