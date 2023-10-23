import { BaseRequestModifier } from "./BaseRequestModifier";

export class FieldsModifier extends BaseRequestModifier {
    public alterHeaders(headers: any) {
        return headers;
    }

    public constructor(public fields:Array<string>) {
        super();
    }

    public modifyBody(body: any) {
        return body;
    }

    public enrichQueryParameters(parameters: any) {
        parameters.fields = parameters.fields ? [...parameters.fields, ...this.fields] : [...this.fields];
        return parameters;
    }
}

export function fields(...fields:Array<string>):FieldsModifier {
    if(!fields || !fields.length) throw new Error("StrapiClient: fields needs at least one field name");

    const sm = new FieldsModifier(fields);

    return sm;
}