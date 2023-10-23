export type Methods = "GET"|"POST"|"PUT"|"DELETE";
export default function makeFetchOptions(method:Methods, body?:any, jwt?:string) {
    const options:any = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    }

    if(body) {
        options.body = JSON.stringify(body);
    }

    if(jwt) {
        options.headers["Authorization"] = `Bearer ${jwt}`;
    }

    return options;
}