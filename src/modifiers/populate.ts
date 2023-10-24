import { isArray, isString } from "lodash";
import { BaseRequestModifier } from "./BaseRequestModifier";

export class PopulateModifier extends BaseRequestModifier {
    public alterHeaders(headers: any) {
        return headers;
    }

    public constructor(public fields:Array<string> = []) {
        super();

        if(!this.fields) this.fields = [];
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
        const { fields } = this;
        let populate = parameters.populate;

        if(fields.find(x => x.endsWith("#count"))) {
            populate = this.toObject(populate);
        }

        if(!populate) {
            populate = fields.length == 1 ? fields[0] : fields;
        } else if(isString(populate)) {
            populate = [
                populate,
                ...this.fields,
            ];
        } else if(isArray(populate)) {
            populate = [
                ...populate,
                ...this.fields,
            ]
        } else {
            for(const field of fields) {
                if(field.endsWith("#count")) {
                    const actualField = field.replace("#count", "");
                    populate[actualField] = { count: true };
                } else if(field.includes(".")) {
                    const obj = this.toObject(field);
                    console.log("field", field, obj);
                    populate = {
                        ...populate,
                        ...obj,
                    }
                } else {
                    populate[field] = true;
                }
            }
        }

        parameters.populate = populate;
        return parameters;
    }
}

export function populate(...fields:Array<string>):PopulateModifier {
    if(!fields || !fields.length) throw new Error("StrapiClient: populate fields can't be empty");

    const sm = new PopulateModifier(fields);

    return sm;
}