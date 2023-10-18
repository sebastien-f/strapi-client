import { BaseRequestModifier } from "./BaseRequestModifier";

type PaginationByPageParameters = {
    type:"page",
    page?:number,
    pageSize?:number,
    withCount?:number,
}

type PaginationByOffsetParameters = {
    type:"offset",
    start?:number,
    limit?:number,
    withCount?:number,

}

export type PaginationParameters = PaginationByOffsetParameters | PaginationByPageParameters;

export class PaginationModifier extends BaseRequestModifier {
    public constructor(public options:PaginationParameters) {
        super();
    }

    public modifyBody(body: any) {
        return body;
    }

    public enrichQueryParameters(parameters: any) {
        if(parameters.pagination) {
            throw new Error("Strapi Client: pagination already set");
        }

        const options = this.options;

        if(options.type == "offset") {
            parameters.pagination = {
                start: options.start,
                limit: options.limit,
                withCount: options.withCount,
            };

        }

        if(options.type == "page") {
            parameters.pagination = {
                page: options.page,
                pageSize: options.pageSize,
                withCount: options.withCount,
            };
        }

        return parameters;
    }

}

// https://docs.strapi.io/dev-docs/api/rest/sort-pagination#pagination

export function pagination(options:PaginationParameters):PaginationModifier {
    const sm = new PaginationModifier(options);

    return sm;
}