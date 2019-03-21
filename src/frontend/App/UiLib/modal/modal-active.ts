/**
 * A reference to an active (currently opened) modal. Instances of this class
 * can be injected into components passed as modal content.
 */
export class NgbActiveModal {
    /**
     * Closes the modal with an optional 'result' value.
     * The 'NgbMobalRef.result' promise will be resolved with provided value.
     */
// tslint:disable-next-line: no-empty
    public close(result?: any): void {}

    /**
     * Dismisses the modal with an optional 'reason' value.
     * The 'NgbModalRef.result' promise will be rejected with provided value.
     */
// tslint:disable-next-line: no-empty
    public dismiss(reason?: any): void {}
}
