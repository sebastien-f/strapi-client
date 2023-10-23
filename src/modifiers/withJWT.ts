import { BaseRequestModifier } from "./BaseRequestModifier";

export class JwtModifier extends BaseRequestModifier {

    public constructor(public jwt:string) {
        super();
    }

    public override alterHeaders(headers: any):any {
        return {
            ...headers,
            Authorization:`Bearer ${this.jwt}`,
        };
    }
}

export function withJWT(jwt:string):JwtModifier {

    const sm = new JwtModifier(jwt);

    return sm;
}