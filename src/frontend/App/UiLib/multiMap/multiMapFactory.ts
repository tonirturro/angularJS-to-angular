import { IMultiMap, IMultiMapFactory } from "../definitions";
import { MultiMap } from "./multimap";

export class MultiMapFactory implements IMultiMapFactory {
    public createNew(): IMultiMap {
        return new MultiMap();
    }
}
