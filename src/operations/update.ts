import { sortBy } from "lodash";
import { BaseRequestModifier } from "../modifiers/BaseRequestModifier";
import { BaseOperation, BaseOperationData } from "./BaseOperation";

export class UpdateOperation<T> extends BaseOperation<T> {
    public constructor(requestModifiers:Array<BaseRequestModifier> = []) {
        super("UpdateOperation", requestModifiers)
    }

    public prepare(extraModifiers:Array<BaseRequestModifier> = []): BaseOperationData {
        const modifiers = sortBy([
            ...extraModifiers,
            ...this.requestModifiers
        ], ["order"]);


        const method = this.getMethod(modifiers)?.method || "PUT";

        return {
            body:this.getBody(modifiers),
            headers:this.getHeaders(modifiers),
            url:this.getUrl(modifiers),
            method,
        }
    }
}

export function update<T>(requestModifiers:Array<BaseRequestModifier> = []) {
    return new UpdateOperation<T>(requestModifiers);
}

