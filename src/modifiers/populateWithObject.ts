import { isArray, isString } from "lodash";
import { BaseRequestModifier } from "./BaseRequestModifier";

export class PopulateWithObjectModifier extends BaseRequestModifier {
    public alterHeaders(headers: any) {
        return headers;
    }

    public constructor(public object:object = {}) {
        super();

        if(!this.object) this.object = [];
    }

    public modifyBody(body: any) {
        return body;
    }

    private recursiveCreate(obj:any, chunks:Array<string>):any {
        if(chunks.length == 0) return obj;

        const currentChunk = chunks[0];
        const nextObj = obj[currentChunk] || {};

        const currentValue = this.recursiveCreate(nextObj, chunks.slice(1));

        obj[currentChunk] = currentValue;

        return obj;
    }


    private getTargetObjectAndCreateIfMissing(obj:any, chunks:Array<string>):any {
        obj = this.recursiveCreate(obj, chunks);

        for(const chunk of chunks) {
            obj = obj[chunk];
        }

        return obj;
    }

    private dotFieldToObject(chunks:Array<string>) {
        const o = this.recursiveCreate({}, chunks);

        let x = o;
        for(var i = 0; i < chunks.length - 1; i++) {
            x = x[chunks[i]];
        }

        x[chunks[chunks.length - 1]] = true;

        return o;
    }

    private chunkate(str:string) {
        return str.split(".");
    }

    private toObject(obj:any) {
        if(!obj) return {};

        if(isString(obj)) {
            const chunks = this.chunkate(obj);

            if(chunks.length == 1) {
                return { [obj]: true };
            } else {
                return {
                    ...this.dotFieldToObject(chunks),
                }
            }
        };

        if(isArray(obj)) {
            const objectified:any = {};
            for(const field of obj) {
                objectified[field] = true;
            }
            return objectified;
        }

        return obj;
    }

    public enrichQueryParameters(parameters: any) {
        const { object } = this;
        let populate = parameters.populate;

        populate = {
            ...this.toObject(populate),
            ...object,
        };

        parameters.populate = populate;
        return parameters;
    }
}

export function populateWithObject(object:object):PopulateWithObjectModifier {
    if(!object) throw new Error("StrapiClient: populate object needs to be provided");

    const sm = new PopulateWithObjectModifier(object);

    return sm;
}