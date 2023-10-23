import { BaseRequestModifier } from "../modifiers/BaseRequestModifier";
import { BaseOperation, BaseOperationData } from "./BaseOperation";

export class GetOperation<T> extends BaseOperation<T> {
    public constructor(requestModifiers:Array<BaseRequestModifier> = []) {
        super("GetOperation", requestModifiers)
    }

    public prepare(extraModifiers:Array<BaseRequestModifier> = []): BaseOperationData {
        const modifiers = [
            ...extraModifiers,
            ...this.requestModifiers
        ]

        const method = this.getMethod(modifiers)?.method || "GET";

        return {
            body:this.warnForNoBody(modifiers), // List don't need a body
            headers:this.getHeaders(modifiers),
            url:this.getUrl(modifiers),
            method,
        }
    }
}

export function get<T>(requestModifiers:Array<BaseRequestModifier> = []) {
    return new GetOperation<T>(requestModifiers);
}

