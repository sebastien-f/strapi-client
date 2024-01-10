import { sortBy } from "lodash";
import { BaseRequestModifier } from "../modifiers/BaseRequestModifier";
import { BaseOperation, BaseOperationData } from "./BaseOperation";

export class CreateOperation<T> extends BaseOperation<T> {
    public constructor(requestModifiers:Array<BaseRequestModifier> = []) {
        super("CreateOperation", requestModifiers)
    }

    public prepare(extraModifiers: Array<BaseRequestModifier> = []): BaseOperationData {
        const modifiers = sortBy([
            ...extraModifiers,
            ...this.requestModifiers
        ], ["order"]);

        const method = this.getMethod(modifiers)?.method || "POST";

        return {
            body:this.getBody(modifiers),
            headers:this.getHeaders(modifiers),
            url:this.getUrl(modifiers),
            method,
        }
    }
}

export function create(requestModifiers:Array<BaseRequestModifier> = []) {
    return new CreateOperation(requestModifiers);
}