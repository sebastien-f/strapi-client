import { BaseRequestModifier } from "./BaseRequestModifier";

type FilterOperators = "$eq" | "$eqi" | "$ne" | "$nei" | "$lt" | "$lte" | "$gt" | "$gte" | "$in" | "$notIn" | "$contains" | "$notContains" | "$containsi" | "$notContainsi" | "$null" | "$notNull" | "$between" | "$startsWith" | "$startsWithi" | "$endsWith" | "$endsWithi" | "$or" | "$and" | "$not";

export class FilterModifier extends BaseRequestModifier {

    public constructor(public field:string, public operator:FilterOperators, public operatorValue:any) {
        super();
    }

    public modifyBody(body: any) {
        return body;
    }

    public enrichQueryParameters(parameters: any) {
        const { field, operator, operatorValue } = this;
        let filters = {...parameters.filters} || {};

        const chunks = this.chunkate(field);
        const target = this.getTargetObjectAndCreateIfMissing(filters, chunks);

        if(!target[operator]) target[operator] = operatorValue;

        parameters.filters = filters;
        return parameters;
    }

    private chunkate(str:string) {
        return str.split(".");
    }

    private getTargetObjectAndCreateIfMissing(obj:any, chunks:Array<string>):any {
        obj = this.recursiveCreate(obj, chunks);

        for(const chunk of chunks) {
            obj = obj[chunk];
        }

        return obj;
    }

    private recursiveCreate(obj:any, chunks:Array<string>):any {
        if(chunks.length == 0) return obj;

        const currentChunk = chunks[0];
        const nextObj = obj[currentChunk] || {};

        const currentValue = this.recursiveCreate(nextObj, chunks.slice(1));

        obj[currentChunk] = currentValue;

        return obj;
    }

}

export function filter(field:string, operator:FilterOperators, operatorValue:any):FilterModifier {
    if(!field) throw new Error("StrapiClient: filter field can't be null");
    if(!operator) throw new Error("StrapiClient: filter operator can't be null");
    if(!operatorValue) throw new Error("StrapiClient: filter operatorValue can't be null");

    const sm = new FilterModifier(field, operator, operatorValue);

    return sm;
}