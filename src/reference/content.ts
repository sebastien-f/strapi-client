import { StrapiClient } from "../client/StrapiClient";

export class ContentReference {
    /**
     *
     * @param strapiClient Strapi Client to match the
     * @param apiPath
     */
    public constructor(public strapiClient:StrapiClient, public apiPath:string) { }
}

export function content(strapiClient:StrapiClient, apiId:string):ContentReference {
    return new ContentReference(strapiClient, apiId);
}