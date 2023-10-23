import { BaseRequestModifier } from "../modifiers/BaseRequestModifier";

/**
 *
 * @param requestModifiers
 * @param queryData
 * @param bodyData
 * @param headers
 * @returns [queryData,bodyData,headers]
 */
export function processModifiers(requestModifiers:Array<BaseRequestModifier> = [], queryData:any = {}, bodyData:any = null, headers:any = {}) {
    if(requestModifiers?.length) {

        for(const rm of requestModifiers) {
            // We don't want to mutate the original
            queryData = queryData ? {...queryData} : {};
            headers = headers ? {...headers} : {};
            // Special case where it can be null and need to stay that way
            bodyData = bodyData ? {...bodyData} : null;

            queryData = rm.enrichQueryParameters(queryData);
            bodyData = rm.modifyBody(bodyData);
            headers = rm.alterHeaders(headers);
        }
    }

    return [queryData, bodyData, headers];

}