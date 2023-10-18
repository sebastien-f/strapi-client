import { isArray, isString } from "lodash";
import { BaseRequestModifier } from "./BaseRequestModifier";

export class PopulateModifier extends BaseRequestModifier {

    public constructor(public fields:Array<string>) {
        super();
    }

    public modifyBody(body: any) {
        return body;
    }

    public enrichQueryParameters(parameters: any) {
        const { fields } = this;
        let populate = parameters.populate;

        if(!populate) {
            populate = fields.length == 1 ? fields[0] : fields;
        } else if(isString(populate)) {
            populate = [
                populate,
                ...this.fields,
            ];
        } else {
            populate = [
                ...populate,
                ...this.fields,
            ]
        }

        parameters.populate = populate;
        return parameters;
    }
}

export function populate(...fields:Array<string>):PopulateModifier {
    if(!fields || !fields.length) throw new Error("StrapiClient: populate fields can't be empty");

    const sm = new PopulateModifier(fields);

    return sm;
}