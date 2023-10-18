import { BaseRequestModifier } from "./BaseRequestModifier";

export class IncludesDraftModifier extends BaseRequestModifier {
    public modifyBody(body: any) {
        return body;
    }

    public enrichQueryParameters(parameters: any) {
        parameters.publicationState = "preview";
        return parameters;
    }
}

export function includesDraft():IncludesDraftModifier {
    return new IncludesDraftModifier();
}