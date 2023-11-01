import { isEmpty, isString, isObject } from "lodash";
import makeFetchOptions, { Methods } from "./makeFetchOptions";
import { StrapiClientOptions } from "./StrapiClientOptions";
import { StrapiError } from "./StrapiError";
import { BaseOperation } from "../operations/BaseOperation";
import { BaseRequestModifier } from "../modifiers/BaseRequestModifier";
import { apiBaseUrl } from "../modifiers/apiBaseUrl";
import { apiPrefix } from "../modifiers/apiPrefix";
import { run } from "./run";
import { apiEndpoint } from "../modifiers/apiEndpoint";
import { get } from "../operations/get";
import { bodyValue } from "../modifiers/bodyValue";
import { method } from "../modifiers/method";
import { raw } from "../operations/raw";
import { jsonContentType } from "../modifiers/contentType";
import { JwtModifier } from "../modifiers/withJWT";

const defaultOptions:StrapiClientOptions = {
    baseUrl:"http://localhost:1337",
    prefix:"/api/",
    showRuntime:false,
    showDebug:false,
    keepFullAuthToken:false,
}

class StrapiClient {
    private options:StrapiClientOptions;
    private jwToken:string = null as any as string;
    private user:AuthUser = null as any as AuthUser;
    private clientModifiers:Array<BaseRequestModifier> = [];

    public constructor(options:StrapiClientOptions=defaultOptions) {
        options = {
            ...defaultOptions,
            ...options,
        }

        let { baseUrl, prefix } = options;

        if(!baseUrl) throw new Error();
        if(!prefix) throw new Error();

        this.clientModifiers.push(apiBaseUrl(baseUrl));
        this.clientModifiers.push(apiPrefix(prefix));

        this.options = options;
    }

    /** @deprecated */
    // public async getMe<T>(jwToken:string):Promise<T> {
    //     const url = this.apiUrl + "users/me";
    //     const options = makeFetchOptions("GET", null, jwToken);

    //     const result = await this.fetch<AuthUser>(url, options);

    //     if(result.type == "text") {
    //         const err = this.processError(result.text, undefined, result.executionTime, url);
    //         throw err;
    //     }

    //     if(this.options.showRunTime) console.log(`[Strapi Client] getMe ran in ${result.executionTime} seconds.`);

    //     this.jwToken = jwToken;
    //     this.user = result.json;

    //     return result.json as T;
    // }

    public logout() {
        this.jwToken = null as any as string;
        this.user = null as any as AuthUser;
    }

    public async localAuth(email:string, password:string, extraModifiers:Array<BaseRequestModifier> = []): Promise<{ jwt:string, user:AuthUser }> {
        const meRequest = raw([
            apiEndpoint("auth/local"),
            bodyValue("identifier", email),
            bodyValue("password", password),
            jsonContentType(),
            method("POST"),
            // we can't send a jwt with the auth
            ...extraModifiers.filter(x => !(x instanceof JwtModifier)),
        ])

        try {
            const r = await run(meRequest, this.clientModifiers);

            if(this.options.showRuntime) console.log(`[localAuth] ran in ${r.executionTime} seconds.`);

            if(r.type == "text")  {
                const sErr = new StrapiError("Local auth error: " + r.text);
                sErr.executionTime = r.executionTime;
                throw sErr;
            }

            this.jwToken = r.json.jwt;
            this.user = r.json.user;

            this.setJwTokenModifier(this.jwToken, false);

            return r.json as { jwt:string, user:AuthUser };

        } catch(error) {
            throw error;
        }
    }

    public setJwtTokenIfNone(jwToken:string) {
        this.setJwTokenModifier(jwToken);
    }

    private setJwTokenModifier(jwtToken:string, onlyIfMissing:boolean = true) {
        let jwtModifierIndex = this.clientModifiers.findIndex(x => x instanceof JwtModifier);
        if(jwtModifierIndex === -1) {
            // modifier is missing, we add it in that case
            this.clientModifiers.push(new JwtModifier(jwtToken));
        } else if(!onlyIfMissing) {
            // it exists, we only replace it if appropriate
            this.clientModifiers[jwtModifierIndex] = new JwtModifier(jwtToken);
        }
    }

    public async run<T>(op:BaseOperation<T>):Promise<T> {
        try {
            const r = await run(op, this.clientModifiers, { showDebug: this.options.showDebug, showRuntime: this.options.showRuntime});
            if(r.type == "json") return r.json as T;
            if(this.options.showRuntime) console.log("ran in", r.executionTime);
            return { result: r.text } as T;
        } catch(error) {
            throw error;
        }
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