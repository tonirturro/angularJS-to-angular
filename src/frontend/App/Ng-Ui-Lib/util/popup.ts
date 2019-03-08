import {
    ComponentFactoryResolver,
    ComponentRef,
    Injector,
    Renderer2,
    TemplateRef,
    ViewContainerRef,
    ViewRef
} from "@angular/core";
import { ContentRef } from "./content-ref";

export class PopupService<T> {
    private windowRef: ComponentRef<T>;
    private contentRef: ContentRef;

    constructor(
        private type: any,
        private injector: Injector,
        private viewContainerRef: ViewContainerRef,
        private renderer: Renderer2,
        private componentFactoryResolver: ComponentFactoryResolver) { }

    public open(content?: string | TemplateRef<any>, context?: any): ComponentRef<T> {
        if (!this.windowRef) {
            this.contentRef = this._getContentRef(content, context);
            this.windowRef = this.viewContainerRef.createComponent(
                this.componentFactoryResolver.resolveComponentFactory<T>(this.type), 0, this.injector,
                this.contentRef.nodes);
        }

        return this.windowRef;
    }

    public close() {
        if (this.windowRef) {
            this.viewContainerRef.remove(this.viewContainerRef.indexOf(this.windowRef.hostView));
            this.windowRef = null;

            if (this.contentRef.viewRef) {
                this.viewContainerRef.remove(this.viewContainerRef.indexOf(this.contentRef.viewRef));
                this.contentRef = null;
            }
        }
    }

    private _getContentRef(content: string | TemplateRef<any>, context?: any): ContentRef {
        if (!content) {
            return new ContentRef([]);
        } else if (content instanceof TemplateRef) {
            const viewRef = this.viewContainerRef.createEmbeddedView(content as TemplateRef<T>, context);
            return new ContentRef([viewRef.rootNodes], viewRef);
        } else {
            return new ContentRef([[this.renderer.createText(`${content}`)]]);
        }
    }
}
