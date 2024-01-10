import { sortBy } from "lodash";
import { BaseRequestModifier } from "../modifiers/BaseRequestModifier";
import { BaseOperation, BaseOperationData } from "./BaseOperation";

export class ListOperation<T> extends BaseOperation<T> {
    public constructor(requestModifiers:Array<BaseRequestModifier> = []) {
        super("ListOperation", requestModifiers)
    }

    public prepare(extraModifiers:Array<BaseRequestModifier> = []): BaseOperationData {
        const modifiers = sortBy([
            ...extraModifiers,
            ...this.requestModifiers
        ], ["order"]);

        const method = this.getMethod(modifiers)?.method || "GET";

        return {
            body:this.warnForNoBody(modifiers), // List don't need a body
            headers:this.getHeaders(modifiers),
            url:this.getUrl(modifiers),
            method,
        }
    }
}

export function list<T>(requestModifiers:Array<BaseRequestModifier> = []) {
    return new ListOperation<T>(requestModifiers);
}

