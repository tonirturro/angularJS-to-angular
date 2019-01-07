// tslint:disable-next-line:no-namespace
declare namespace jasmine {
    // tslint:disable-next-line:interface-name
    interface Matchers<T> {
        toBePositionedAt(top: number, left: number): boolean;
    }
}
