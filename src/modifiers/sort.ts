import { isString } from "lodash";
import { BaseRequestModifier } from "./BaseRequestModifier";

type SortOrder = "asc"|"desc";

export class SortModifier extends BaseRequestModifier {
    public alterHeaders(headers: any) {
        return headers;
    }

    public constructor(public field:string, public sortOrder:SortOrder) {
        super();
    }

    public modifyBody(body: any) {
        return body;
    }

    public enrichQueryParameters(parameters: any) {
        const parameter = this.make();
        // If we don't have any sort yet, we just return a simple object
        if(!parameters.sort) {
            parameters.sort = parameter;
            return parameters;
        }

        let sorts = isString(parameters.sort) ? [parameters.sort] : [...parameters.sort];

        sorts.push(parameter);

        parameters.sort = sorts;

        return parameters;
    }

    private make():string {
        let str = this.field;

        if(this.sortOrder === "desc") {
            str += ":desc";
        }

        return str;
    }

}

// https://docs.strapi.io/dev-docs/api/rest/sort-pagination

export function sort(field:string, order:SortOrder = "asc"):SortModifier {
    const sm = new SortModifier(field, order);

    return sm;
}