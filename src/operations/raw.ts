import { sortBy } from "lodash";
import { BaseRequestModifier } from "../modifiers/BaseRequestModifier";
import { BaseOperation, BaseOperationData } from "./BaseOperation";

export class RawOperation<T> extends BaseOperation<T> {
    public constructor(requestModifiers:Array<BaseRequestModifier> = []) {
        super("RawOperation", requestModifiers)
    }

    public prepare(extraModifiers:Array<BaseRequestModifier> = []): BaseOperationData {
        const modifiers = sortBy([
            ...extraModifiers,
            ...this.requestModifiers
        ], ["order"]);


        const method = this.getMethod(modifiers)?.method || "GET";

        return {
            body:this.getBody(modifiers),
            headers:this.getHeaders(modifiers),
            url:this.getUrl(modifiers),
            method,
        }
    }
}

export function raw<T>(requestModifiers:Array<BaseRequestModifier> = []) {
    return new RawOperation<T>(requestModifiers);
}

