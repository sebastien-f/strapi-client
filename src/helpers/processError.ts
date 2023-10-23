import { isObject, isString } from "lodash";
import { StrapiError } from "../client/StrapiError";

function getErrorMessageFromObject(obj:any):string {
    if(isString(obj)) {
        return obj;
    } else if(isObject(obj)) {
        const objectError = obj as any;
        if(objectError.message) {
            return objectError.message;
        }

        if(objectError.error) {
            // Can happen with fetch errors
            return getErrorMessageFromObject(objectError.error);
        }

        // No idea what this can be
        return JSON.stringify(objectError);

    } else {
        return new String(obj).toString();
    }
}

export function processError(error:any, response?:Response, executionTime?:number, url?:string, options?:RequestInit, keepFullAuthToken:boolean = false) {
    const errorMessage = getErrorMessageFromObject(error);
    const err = new StrapiError(errorMessage);

    err.executionTime = executionTime;
    err.url = url;

    if(options) {
        err.options = options;
        if(!keepFullAuthToken) {
            const headers = err.options?.headers as any;
            if(headers.Authorization) {
                headers.Authorization = headers.Authorization.substring(0, 15) + "..."
            }
        }
    }

    if(response) {
        err.statusCode = response.status;
        err.statusMessage = response.statusText || errorMessage;
    }

    return err;
}