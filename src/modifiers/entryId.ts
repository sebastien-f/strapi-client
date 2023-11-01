import { BaseRequestModifier } from "./BaseRequestModifier";

export class EntryIdModifer extends BaseRequestModifier {

    public constructor(public entryId:number) {
        super();
    }

    public override enrichQueryParameters(parameters: any) {
        parameters.entryId = this.entryId.toString();

        return parameters;
    }
}

export function entryId(entryId:number):EntryIdModifer {
    if(isNaN(entryId)) throw new Error("entryId must be a number");

    const sm = new EntryIdModifer(entryId);

    return sm;
}