import { isEmpty, isString, isObject } from "lodash";
import makeFetchOptions, { Methods } from "./makeFetchOptions";
import { StrapiClientOptions } from "./StrapiClientOptions";



const defaultOptions:StrapiClientOptions = {
    baseUrl:"http://localhost:1337",
    prefix:"/api/",
    showRunTime:false,
}

class StrapiClient {
    private apiUrl:string;
    private options:StrapiClientOptions;
    private jwToken:string = null as any as string;
    private user:AuthUser = null as any as AuthUser;

    public constructor(options:StrapiClientOptions=defaultOptions) {
        options = {
            ...defaultOptions,
            ...options,
        }

        let { baseUrl, prefix } = options;

        if(!baseUrl) throw new Error();
        if(!prefix) throw new Error();

        if(baseUrl.endsWith("/")) {
            baseUrl = options.baseUrl = baseUrl.substring(0, baseUrl.length - 1);
        }
        if(!prefix.startsWith("/")) prefix = "/" + prefix;
        if(!prefix.endsWith("/")) prefix += "/";

        this.apiUrl = baseUrl + prefix;
        this.options = options;
    }

    public async getMe(jwToken:string) {
        const url = this.apiUrl + "users/me";
        const options = makeFetchOptions("GET", null, jwToken);

        const result = await this.fetch<AuthUser>(url, options);

        if(result.type == "text") {
            console.error("getMe text error", result);
            throw new Error("getMe error");
        }

        console.log(`[getMe] ran in ${result.executionTime} seconds.`);

        this.jwToken = jwToken;
        this.user = result.json;

        return result.json;
    }

    public async localAuth(email:string, password:string) {
        const url = this.apiUrl + "auth/local";
        const options = makeFetchOptions("POST", {
            identifier:email,
            password:password,
        });

        const result = await this.fetch<AuthResponse>(url, options);

        if(result.type == "text") {
            console.error("localAuth text error", result);
            throw new Error("localAuth error");
        }


        console.log(`[localAuth] ran in ${result.executionTime} seconds.`);

        this.jwToken = result.json.jwt;
        this.user = result.json.user;

        return result.json;
    }

    public setJwtTokenIfNone(jwToken:string) {
        if(!this.jwToken) this.jwToken = jwToken;
    }

    public async run<TResponse, TBody=any>(apiId:string, method:Methods, queryString:string|null, body:TBody, entryId?:number):Promise<TResponse> {
        const url = this.apiUrl + apiId + (entryId == null ? "" : `/${entryId}`) + (isEmpty(queryString) ? "" : `?${queryString}`);
        const options = makeFetchOptions(method, body, this.jwToken);

        const result = await this.fetch<TResponse>(url, options);

        if(result.type == "text") {
            console.error("run text error", result);
            const err = this.processError(result.text, undefined, result.executionTime, url);
            throw err;
        }

        if(this.options.showRunTime) console.log(`[Strapi Client] ran in ${result.executionTime} seconds.`);

        return result.json;
    }

    private async fetch<T>(url:string, options:RequestInit):Promise<StrapiClientFetchResult<T>> {
        let response:Response = null as any as Response;
        const s = new Date().getTime();

        try {
            response = await fetch(url, options);
            const end = new Date().getTime();
            const executionTime = (end-s)/1000;
            const clone = response.clone();

            if(response.ok) {
                const clone = response.clone();
                try {
                    const jsonResult = await response.json()
                    return {
                        type:"json",
                        json:jsonResult,
                        executionTime
                    }
                } catch {
                    const textResult = await clone.text();
                    return {
                        type:"text",
                        text:textResult,
                        executionTime
                    }
                }
            }

            // response is not ok, let's try to see what it says
            // in any case we throw it to let it be processed properly
            try {
                const jsonError = await response.json()
                throw new Error(jsonError);
            } catch {
                const txtError = await clone.text();
                throw new Error(txtError);
            }

        } catch(error) {
            const end = new Date().getTime();
            const executionTime = (end - s) / 1000;

            const err = this.processError(error, response, executionTime, url);

            throw err;
        }
    }

    private processError(error:any, response?:Response, executionTime?:number, url?:string) {
        let errorMessage = null;

        if(isString(error)) {
            errorMessage = `[Strapi Client] ${error}`;
        } else if(isObject(error)) {
            const anyError = error as any;
            if(anyError.error) {
                errorMessage = anyError.error;
            } else if(anyError.message) {
                errorMessage = anyError.message;
            } else {
                errorMessage = "[Strapi Client] error: see error details";
            }
        } else {
            errorMessage = "[Strapi Client] unknown error"
        }

        const err = new StrapiError(errorMessage);
        err.executionTime = executionTime;
        err.url = url;

        if(response) {
            err.statusCode = response.status;
            err.statusMessage = response.statusText;
        }

        return err;
    }

}


type StrapiClientJson<T> = {
    type:"json",
    json:T,
    executionTime?:number;
}

type StrapiClientText = {
    type:"text",
    text:string,
    executionTime?:number;

}

type AuthResponse = {
    "jwt": string,
    "user": AuthUser,
}

type AuthUser = {
    "blocked": boolean,
    "confirmed": boolean,
    "createdAt": string,
    "email": string,
    "id": number,
    "provider": string,
    "uid": string,
    "updatedAt": string,
    "username": string,
}

type StrapiClientFetchResult<T> = StrapiClientJson<T>|StrapiClientText;

export { StrapiClient };