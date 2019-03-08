// tslint:disable-next-line:no-namespace
declare namespace jasmine {
    // tslint:disable-next-line:interface-name
    interface Matchers<T> {
      toHaveCssClass(arg0: string): any;
        toBeResolvedWith(expected: any): boolean;
        toBeRejectedWith(expected: any): boolean;
        toHaveModalsOpen(expected: number): boolean;
        toHaveModalOpenWithContent(content: string, selector: string): boolean;
        toHaveBackdrop(): boolean;
        toHaveFocus(): boolean;
        toHaveClass(expected: string): boolean;
    }
}
