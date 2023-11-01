import { join } from "urlcat";

export function multiJoin(separator:string, ...parts:Array<string>):string {
    if(parts.length < 2) throw new Error("can't multijoin less than 2 items");

    let result = join(parts[0], separator, parts[1]);

    if(parts.length > 2) {
        for(let i = 2; i < parts.length; i++) {
            result = join(result, separator, parts[i]);
        }
    }

    return result;

}