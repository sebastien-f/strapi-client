import { isArray, isPlainObject } from "lodash";
import { Entry } from "./operations/Entry";

type Flattened<T> = T & { id: number };

export function flatten<T>(entry:Entry<T>, recursive?:boolean):Flattened<T> {
    recursive = !!recursive;

    if(!entry) return entry;

    if(entry.id && entry.attributes) {
        let attributes = entry.attributes;

        if(recursive) {
            const keys = Object.keys(attributes);
            const o = (attributes as any);
            for(const key of keys) {
                const value = o[key];
                const hasDataKey = value && Object.keys(value).includes("data");

                if(value === null || value === undefined) {
                    o[key] = value;
                }
                else if(hasDataKey) {
                    const newValue = flatten(value.data, recursive);
                    o[key] = newValue;
                } else if(isPlainObject(value)) {
                    o[key] = flatten(value, recursive);
                }
            }
        }

        return {
            id:entry.id,
            ...attributes,
        }
    }


    if(isArray(entry)) {
        for(let i = 0; i < entry.length; i++) {
            entry[i] = flatten(entry[i], recursive)
        }
        return entry as any as Flattened<T>;
    } else if(isPlainObject(entry)) {
        const o = (entry as any);
        const keys = Object.keys(o);
        for(const key of keys) {
            const value = o[key];

            if(value && value.data) {
                const newValue = flatten(value.data, recursive);
                o[key] = newValue;
            } else if(isPlainObject(value)) {
                o[key] = flatten(value, recursive);
            }
        }

        return o;
    }


    console.log("no idea how to handle", entry);
    return entry as any as Flattened<T>;

}