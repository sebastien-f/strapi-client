import { sortBy } from "lodash";
import { BaseRequestModifier } from "../modifiers/BaseRequestModifier";
import { BaseOperation, BaseOperationData } from "./BaseOperation";

export class DeleteOperation<T> extends BaseOperation<T> {
    public constructor(requestModifiers:Array<BaseRequestModifier> = []) {
        super("DeleteOperation", requestModifiers)
    }

    public prepare(extraModifiers:Array<BaseRequestModifier> = []): BaseOperationData {
        const modifiers = sortBy([
            ...extraModifiers,
            ...this.requestModifiers
        ], ["order"]);


        const method = this.getMethod(modifiers)?.method || "DELETE";

        return {
            body:this.warnForNoBody(modifiers), // List don't need a body
            headers:this.getHeaders(modifiers),
            url:this.getUrl(modifiers),
            method,
        }
    }
}

export function del<T>(requestModifiers:Array<BaseRequestModifier> = []) {
    return new DeleteOperation<T>(requestModifiers);
}

