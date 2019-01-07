import { IQService, IServiceProvider } from "angular";
import * as angular from "angular";

export interface IResolverProvider  {
    setResolver(resolver: any);
}

export class Resolver implements IResolverProvider, IServiceProvider {

    public $get = ["$injector", "$q", ($injector: angular.auto.IInjectorService, $q: IQService) => {
        const resolver: any = this.resolver ? $injector.get(this.resolver) : null;
        return {
          resolve: (invocables, locals, parent, self) => {
            if (resolver) {
              return resolver.resolve(invocables, locals, parent, self);
            }

            const promises = [];

            angular.forEach(invocables, (value) => {
              if (angular.isFunction(value) || angular.isArray(value)) {
                promises.push($q.resolve($injector.invoke(value)));
              } else if (angular.isString(value)) {
                promises.push($q.resolve($injector.get(value)));
              } else {
                promises.push($q.resolve(value));
              }
            });

            return $q.all(promises).then((resolves) => {
              const resolveObj = {};
              let resolveIter = 0;
              angular.forEach(invocables, (value, key) => {
                resolveObj[key] = resolves[resolveIter++];
              });

              return resolveObj;
            });
          }
        };
      }];

    private resolver = null;

    public setResolver(resolver: any) {
        this.resolver = resolver;
    }
}
