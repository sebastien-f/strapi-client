import { UrlParameters } from "../types";
import { BaseRequestModifier } from "./BaseRequestModifier";

export class ApiBaseUrlModifer extends BaseRequestModifier {

    public constructor(public url:string) {
        super();
    }

    public override generateUrl(url: UrlParameters):UrlParameters {
        const n = { ... url };
        n.base = this.url;
        return n;
    }
}

export function apiBaseUrl(url:string):ApiBaseUrlModifer {
    if(!url || !url?.trim()?.length) throw new Error("url can't be null or empty");

    const sm = new ApiBaseUrlModifer(url);

    return sm;
}