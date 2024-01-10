import { processError } from "../helpers/processError";
import { BaseRequestModifier } from "../modifiers/BaseRequestModifier";
import { BaseOperation } from "../operations/BaseOperation";
import { StrapiError } from "./StrapiError";

export type RunOptions = {
    showDebug?:boolean;
    showRuntime?:boolean;
    timeout?:number;
}

export async function run<T>(op:BaseOperation<T>, extraModifiers:Array<BaseRequestModifier> = [], runOptions:RunOptions = {}) {
    const p = op.prepare(extraModifiers);
    const { body, headers, method, url } = p;
    const options:RequestInit = {
        headers: { ...headers },
        method: method,
    }

    if(body) options.body = JSON.stringify(body);

    let response:Response = null as any as Response;
    const s = new Date().getTime();

    try {
        if(runOptions.showDebug) console.log(url, options);

        let promise:Promise<Response> = null as any as Promise<Response>;

        if(runOptions.timeout && !isNaN(runOptions.timeout)) {
            if(AbortSignal.timeout) {
                // RN hermes has no support for this
                options.signal = AbortSignal.timeout(runOptions.timeout);
                promise = fetch(url, options);
            } else {
                const controller = new AbortController();
                options.signal = controller.signal;
                if(options.signal) options.signal.addEventListener("abort", () => controller.abort);
                const timeout = setTimeout(() => controller.abort(), runOptions.timeout);
                promise = fetch(url, options).finally(() => clearTimeout(timeout));
            }
        } else {
            promise = fetch(url, options);
        }

        response = await promise;
        const end = new Date().getTime();
        const executionTime = (end-s)/1000;
        const clone = response.clone();

        if(runOptions.showRuntime) console.log("run ran in", executionTime);

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
        let err:StrapiError|undefined = undefined;
        try {
            const jsonError = await response.json()
            err = processError(jsonError, response, executionTime, url, options);
        } catch {
            const txtError = await clone.text();
            err = processError(txtError, response, executionTime, url, options);
        }

        throw err;


    } catch(error) {
        const end = new Date().getTime();
        const executionTime = (end - s) / 1000;

        const err = processError(error, response, executionTime, url, options);

        throw err;
    }

}