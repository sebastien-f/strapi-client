import { Methods } from "../client/makeFetchOptions";
import { BaseRequestModifier } from "./BaseRequestModifier";

export type RawModifierParameters = {
    headers?:any;
    body?:any;
    querystring?:any;
    method?:Methods;
    url?:UrlParameters;
}

export class RawModifier extends BaseRequestModifier {
    public constructor(public parameters:RawModifierParameters) {
        super();
    }

    public override alterHeaders(headers: any) {
        if(!this.parameters.headers) return headers;

        headers = {
            ...headers,
            ...this.parameters.headers,
        }
        return headers;
    }

    public override modifyBody(body: any) {
        if(!this.parameters.body) return body;

        body = {
            ...body,
            ...this.parameters.body,
        }
        return body;
    }

    public override enrichQueryParameters(parameters: any) {
        if(!this.parameters.querystring) return parameters;

        parameters = {
            ...parameters,
            ...this.parameters.querystring
        }
        return parameters;
    }

    public override alterMethod(method: any) {
        if(!this.parameters.method) return method;

        return {
            method:this.parameters.method,
        };
    }

    public override generateUrl(url: UrlParameters): UrlParameters {
        if(!this.parameters.url) return url;

        return {
            ...url,
            ...this.parameters.url,
        }
    }


}

export function rawModifier(parameters:RawModifierParameters):RawModifier {
    const sm = new RawModifier(parameters);

    return sm;
}