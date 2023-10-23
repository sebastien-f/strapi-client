import { BaseRequestModifier } from "../modifiers/BaseRequestModifier";
import { ContentReference } from "../reference/content";

export async function create<T>(content:ContentReference, value:T, requestModifiers:Array<BaseRequestModifier> = []):Promise<T> {
    throw new Error("To be reimplemented")

    /*
    const client = content.strapiClient;

    let queryData:any = {};
    let bodyData:any = {
        data:value
    };
    let headers:any = {};

    if(requestModifiers?.length) {
        for(const rm of requestModifiers) {
            queryData = rm.enrichQueryParameters(queryData);
            bodyData = rm.modifyBody(bodyData);
            headers = rm.alterHeaders(headers);
        }
    }


    const result = await client.runOld<any>(content.apiPath, "POST", null, bodyData);
    return result;
    */
}