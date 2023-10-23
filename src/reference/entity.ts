import { StrapiClient } from "../client/StrapiClient";

export class EntityReference {
    /**
     *
     * @param strapiClient Strapi Client to match the
     * @param apiPath path to the api endpoint, without /api/
     */
    public constructor(public strapiClient:StrapiClient, public apiPath:string) { }
}

export function entity(strapiClient:StrapiClient, apiPath:string):EntityReference {
    return new EntityReference(strapiClient, apiPath);
}