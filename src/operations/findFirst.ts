import qs from "qs";
import { BaseRequestModifier } from "../modifiers/BaseRequestModifier";
import { Entry } from "./Entry";
import { ContentReference } from "../reference/content";
import { processModifiers } from "../helpers/processModifiers";
import { Methods } from "../client/makeFetchOptions";

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

type FindFirstOptions = {
    method?:Methods;
}

export async function findFirst<T>(content:ContentReference, requestModifiers:Array<BaseRequestModifier> = [], options:FindFirstOptions = {}):Promise<Entry<T>|null> {
    /*
    const client = content.strapiClient;

    const [ queryData, bodyData, headers] = processModifiers(requestModifiers);

    const querystring = qs.stringify(queryData);
    const method = options?.method || "GET";

    const result = await client.runOld<Find<T>>(content.apiPath, method, querystring, bodyData);
    if(result.meta.pagination.total == 0) return null;

    // S'il y en a plus que 1 on ne renvoie que le premier qui match, mais on warn
    if(result.meta.pagination.total > 1) {
        console.warn(`findOne got ${result.meta.pagination.total} instead of one.`)
    }

    return result.data[0];
    */
    throw new Error("To be reimplemented")

}