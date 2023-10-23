import { ContentReference } from "../reference/content";

export async function update<T>(content:ContentReference, id:number, value:Partial<T>):Promise<any> {
    /*
    const client = content.strapiClient;
    const bodyData = {
        data:value
    };

    const result = await client.runOld<any>(content.apiPath, "PUT", null, bodyData, id);
    return result;
    */
   throw new Error("To be reimplemented")
}