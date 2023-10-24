import { BaseRequestModifier } from "./BaseRequestModifier";

export class DataBodyModifier extends BaseRequestModifier {
    public constructor(public body:any) {
        super();
    }

    public modifyBody(body: any):any {
        return {
            ...body,
            data: {
                ...(body.data ?? {}),
                ...this.body,
            }
        };
    }
}

export function dataBody(body:any):DataBodyModifier {
    if(!body) throw new Error("body can't be null");

    const sm = new DataBodyModifier(body);

    return sm;
}