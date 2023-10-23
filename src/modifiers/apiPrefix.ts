import { BaseRequestModifier } from "./BaseRequestModifier";

export class ApiPrefixModifer extends BaseRequestModifier {

    public constructor(public prefix:string) {
        super();
    }

    public override generateUrl(url: UrlParameters):UrlParameters {
        const n = { ... url };
        n.prefix = this.prefix;
        return n;
    }
}

export function apiPrefix(prefix:string):ApiPrefixModifer {
    if(!prefix || !prefix?.trim()?.length) throw new Error("prefix can't be null or empty");

    const sm = new ApiPrefixModifer(prefix);

    return sm;
}