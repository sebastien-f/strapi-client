import { isArray } from "lodash";
import { BaseRequestModifier } from "../modifiers/BaseRequestModifier";
import { JwtModifier } from "../modifiers/withJWT";

export function stripJwtModifier(modifiers:Array<BaseRequestModifier>): Array<BaseRequestModifier> {
    if(!isArray(modifiers)) return modifiers as any as Array<BaseRequestModifier>;

    return modifiers.filter(x => !(x instanceof JwtModifier));
}