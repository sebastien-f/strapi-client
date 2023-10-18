import { StrapiClient } from "../client/StrapiClient";

export class ContentReference {
    public constructor(public strapiClient:StrapiClient, public apiId:string) { }
}

export function content(strapiClient:StrapiClient, apiId:string):ContentReference {
    return new ContentReference(strapiClient, apiId);
}