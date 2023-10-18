import qs from "qs";
import { BaseRequestModifier } from "../modifiers/BaseRequestModifier";
import { Entry } from "./Entry";
import { ContentReference } from "../reference/content";

type Find<T> = {
    data:Array<Entry<T>>;
    meta: {
        pagination: {
            page: number,
            pageSize: number,
            pageCount: number,
            total: number,
        }
    }
}

export async function find<T>(content:ContentReference, requestModifiers:Array<BaseRequestModifier> = []):Promise<Find<T>> {
    const client = content.strapiClient;
    let queryData:any = {};
    let bodyData:any = null;

    if(requestModifiers?.length) {
        for(const rm of requestModifiers) {
            queryData = rm.enrichQueryParameters(queryData);
            bodyData = rm.modifyBody(bodyData);
        }
    }

    const querystring = qs.stringify(queryData);

    const result = await client.run<Find<any>>(content.apiId, "GET", querystring, bodyData);
    return result;

}