import { BaseRequestModifier } from "./BaseRequestModifier";

export class JwtModifier extends BaseRequestModifier {

    public constructor(public jwt:string) {
        super();
    }

    public override alterHeaders(headers: any):any {
        const newHeaders = {
            ...headers,
            Authorization:this.jwt ? `Bearer ${this.jwt}` : null,
        }

        return newHeaders;
    }
}

export function withJWT(jwt:string, order:number = 0):JwtModifier {

    const sm = new JwtModifier(jwt);

    return sm;
}