export type StrapiClientOptions = {
    /** Base url, without the api endpoint, ideally not ending with a /. Default http://localhost:1337 */
    baseUrl?:string;
    /** Api prefix, default /api */
    prefix?:string;
    /** Display in the console the time used to run the query, default false */
    showRuntime?:boolean;
    /** Display debug informations about to query */
    showDebug?:boolean;
    /** Displays the full auth token in error, default false (and keep it that way) */
    keepFullAuthToken?:boolean;
    /** Timeout for the requests */
    timeout?:number;
}