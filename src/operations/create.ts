import { ContentReference } from "../reference/content";

export async function create<T>(content:ContentReference, value:T):Promise<T> {
    const client = content.strapiClient;
    const bodyData = {
        data:value
    };

    const result = await client.run<any>(content.apiId, "POST", null, bodyData);
    return result;

}