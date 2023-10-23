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


/** @deprecated */
export async function find<T>(content:ContentReference, requestModifiers:Array<BaseRequestModifier> = []):Promise<Find<T>> {
    throw new Error("deprecated")
}