import { UrlParameters } from "../types";

export abstract class BaseRequestModifier {
    public order:number = 0;

    public modifyBody(body: any) {
        return body;
    }

    public enrichQueryParameters(parameters: any) {
        return parameters;
    }

    public generateUrl(url: UrlParameters):UrlParameters {
        return url;
    }

    public alterHeaders(headers: any) {
        return headers;
    }

    public alterMethod(method: any) {
        return method;
    }
}