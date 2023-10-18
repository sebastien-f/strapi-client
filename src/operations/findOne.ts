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

export async function findOne<T>(content:ContentReference, requestModifiers:Array<BaseRequestModifier> = []):Promise<Entry<T>|null> {
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

    const result = await client.run<Find<T>>(content.apiId, "GET", querystring, bodyData);
    if(result.meta.pagination.total == 0) return null;

    // S'il y en a plus que 1 on ne renvoie que le premier qui match, mais on warn
    if(result.meta.pagination.total > 1) {
        console.warn(`findOne got ${result.meta.pagination.total} instead of one.`)
    }

    return result.data[0];

}