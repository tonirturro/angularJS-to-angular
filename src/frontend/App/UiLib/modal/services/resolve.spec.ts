import { IQService, IRootScopeService } from "angular";
import * as angular from "angular";
import { IResolver } from "../../definitions";

describe("Given a resolve provider", () => {
    beforeEach(angular.mock.module("ui-lib"));

    it("should resolve invocables and return promise with object of resolutions", () => {
        angular.mock.module(($provide) => {
            $provide.factory("bar", () => {
                return "bar";
            });
        });

        angular.mock.inject(($q: IQService, $rootScope: IRootScopeService, $uibResolve: IResolver) => {
            $uibResolve.resolve({
                bar: $q.resolve("baz"),
                baz:  () => {
                    return "boo";
                },
                foo: "bar",
            }).then((resolves) => {
                expect(resolves).toEqual({
                    bar: "baz",
                    baz: "boo",
                    foo: "bar"
                });
            });

            $rootScope.$digest();
        });
    });

    describe("with custom resolver",  () => {
        beforeEach(angular.mock.module(($provide, $uibResolveProvider) => {
            $provide.factory("$resolve", () => {
                return {
                    resolve: jasmine.createSpy()
                };
            });

            $uibResolveProvider.setResolver("$resolve");
        }));

        it("should call $resolve.resolve", inject(($uibResolve, $resolve) => {
            $uibResolve.resolve({ foo: "bar" }, {}, null, null);

            expect($resolve.resolve).toHaveBeenCalledWith({ foo: "bar" }, {}, null, null);
        }));
    });
});
