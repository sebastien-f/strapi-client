import urlcat, { join } from "urlcat";
import { Methods } from "../client/makeFetchOptions";
import { BaseRequestModifier } from "../modifiers/BaseRequestModifier";
import { UrlParameters } from "../types";

export type BaseOperationData = {
    body:any;
    url:string;
    headers:any;
    method:Methods;
}

export abstract class BaseOperation<T> {
    protected constructor(protected typeName:string, public requestModifiers:Array<BaseRequestModifier> = []) { }

    public abstract prepare(extraModifiers?:Array<BaseRequestModifier>):BaseOperationData;

    protected getUrl(modifiers:Array<BaseRequestModifier>): string {

        let url:UrlParameters = {};
        let querystring:any = {}
        for(const modifier of modifiers) {
            url = modifier.generateUrl(url);
            querystring = modifier.enrichQueryParameters(querystring)
        }

        if(!url.base) throw new Error(`${this.typeName} requires an api base url`);
        if(!url.prefix) throw new Error(`${this.typeName} requires an api prefix`);
        if(!url.endpoint) throw new Error(`${this.typeName} requires an endpoint`);

        return urlcat(join(url.base, "/", url.prefix), url.endpoint, querystring);
    }

    protected getHeaders(modifiers:Array<BaseRequestModifier>) {
        let headers:any = {};

        for(const modifier of modifiers) {
            headers = modifier.alterHeaders(headers);
        }

        return headers;
    }

    protected getBody(modifiers:Array<BaseRequestModifier>) {
        let body:any = {};

        for(const modifier of modifiers) {
            body = modifier.modifyBody(body);
        }

        return body;
    }

    protected warnForNoBody(modifiers:Array<BaseRequestModifier>) {
        let body = {};
        for(const modifier of modifiers) {
            body = modifier.modifyBody(body);
        }

        const keys = Object.keys(body);
        if(keys.length > 0) {
            console.warn(`${this.typeName} does not send a body. Body modifiers will be ignored`, body);
        }

        return null;
    }

    protected getMethod(modifiers:Array<BaseRequestModifier>):{method:Methods} {
        let method:any = {};

        for(const modifier of modifiers) {
            method = modifier.alterMethod(method);
        }

        return method;
    }
}