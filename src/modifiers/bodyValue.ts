import { BaseRequestModifier } from "./BaseRequestModifier";

export class BodyValueModifier extends BaseRequestModifier {
    public constructor(public key:string, public value:any) {
        super();
    }

    public modifyBody(body: any):any {
        return {
            ...body,
            [this.key]:this.value,
        };
    }
}

export function bodyValue(key:string, value:any):BodyValueModifier {
    if(!key?.trim()?.length) throw new Error("key can't be null or empty");

    const sm = new BodyValueModifier(key, value);

    return sm;
}