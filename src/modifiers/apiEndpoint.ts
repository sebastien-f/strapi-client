import { UrlParameters } from "../types";
import { BaseRequestModifier } from "./BaseRequestModifier";

export class ApiEndpoint extends BaseRequestModifier {

    public constructor(public endpoint:string) {
        super();
    }

    public override generateUrl(url: UrlParameters):UrlParameters {
        const n = { ... url };
        n.endpoint = this.endpoint;
        return n;
    }
}

export function apiEndpoint(endpoint:string):ApiEndpoint {
    if(!endpoint || !endpoint?.trim()?.length) throw new Error("endpoint can't be null or empty");

    const sm = new ApiEndpoint(endpoint);

    return sm;
}