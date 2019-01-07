import { IStakedMap } from "../definitions";

export class StackedMap implements IStakedMap {

    private stack = [];

    public add(key: any, value: any) {
        this.stack.push({ key, value });
    }

    public get(key: any): any {
        return this.stack.find((item) => item.key === key);
    }

    public keys(): any[] {
        return this.stack.map((item) => item.key);
    }

    public top() {
        return this.stack[this.stack.length - 1];
    }

    public remove(key: any) {
        const idx = this.stack.findIndex((item) => item.key === key);
        return this.stack.splice(idx, 1)[0];
    }

    public removeTop() {
        return this.stack.pop();
    }

    public length(): number {
        return this.stack.length;
    }
}
