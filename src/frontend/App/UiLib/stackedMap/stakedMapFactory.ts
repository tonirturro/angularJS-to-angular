import { IStackedMapFactory, IStakedMap } from "../definitions";
import { StackedMap } from "./stackedMap";

export class StackedMapFactory implements IStackedMapFactory {
    public createNew(): IStakedMap {
        return new StackedMap();
    }
}
