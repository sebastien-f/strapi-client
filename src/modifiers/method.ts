import { Methods } from "../client/makeFetchOptions";
import { BaseRequestModifier } from "./BaseRequestModifier";

export class MethodModifier extends BaseRequestModifier {

    public constructor(public method:Methods) {
        super();
    }

    public override alterMethod(method: any):any {
        return {
            method:this.method,
        };
    }
}

export function method(method:Methods):MethodModifier {

    const sm = new MethodModifier(method);

    return sm;
}