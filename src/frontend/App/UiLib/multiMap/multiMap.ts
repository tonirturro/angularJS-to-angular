import { IMultiMap } from "../definitions";

export class MultiMap implements IMultiMap {

    private map = {};

    public entries(): any[] {
        return Object.keys(this.map).map((key) => {
            return {
                key,
                value: this.map[key]
            };
        });
    }

    public get(key: string) {
        return this.map[key];
    }

    public hasKey(key: string): boolean {
        return !!this.map[key];
    }

    public keys(): string[] {
        return Object.keys(this.map);
    }

    public put(key: string, value: any) {
        if (!this.map[key]) {
            this.map[key] = [];
        }

        this.map[key].push(value);
    }

    public remove(key: string, value: any) {
        const values = this.map[key];

        if (!values) {
          return;
        }

        const idx = values.indexOf(value);

        if (idx !== -1) {
          values.splice(idx, 1);
        }

        if (!values.length) {
          delete this.map[key];
        }
    }
}
