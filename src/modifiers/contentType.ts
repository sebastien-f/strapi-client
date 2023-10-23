import { BaseRequestModifier } from "./BaseRequestModifier";

export class ContentTypeModifier extends BaseRequestModifier {

    public constructor(public contentType:string) {
        super();
    }

    public override alterHeaders(headers: any):any {
        return {
            ...headers,
            ["Content-Type"]: this.contentType,
        };
    }
}

export function contentType(contentType:string):ContentTypeModifier {

    const sm = new ContentTypeModifier(contentType);

    return sm;
}

export function jsonContentType(): ContentTypeModifier {
    return new ContentTypeModifier("application/json");
}