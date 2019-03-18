import { APP_BASE_HREF } from "@angular/common";
import { TestBed } from "@angular/core/testing";
import { UIRouterModule } from "@uirouter/angular";
import { ViewWrapperComponent } from "./view-wrapper.component";

describe("Given a view wrapper", () => {

    it("Can be instatiated", () => {
        TestBed.configureTestingModule({
            declarations: [ ViewWrapperComponent ],
            imports: [
                UIRouterModule.forRoot()
            ],
            providers: [{
                provide: APP_BASE_HREF,
                useValue : "/"
            }]
        });

        const fixture = TestBed.createComponent(ViewWrapperComponent);
        expect(fixture.nativeElement).toBeDefined();
    });

});
