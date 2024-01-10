export type UrlParameters = {
    base?:string;
    endpoint?:string;
    prefix?:string;
    document?:number;
}

export type WithId = {
    id: number;
}

export type WithAttributes<TAttributes> = {
    attributes: TAttributes;
}

export type WithMeta<TMeta> = {
    meta:TMeta;
}

export type WithData<TData> = {
    data:TData;
}

export type WithTimestamps = {
    createdAt:string;
    updatedAt:string;
}

export type WithPublish = {
    publishedAt: string;
}

export type WithLocale = {
    locale: string;
}

export type StandardEntry<TAttributes> = WithId & WithAttributes<TAttributes>;
export type StandardEntriesData<TAttributes> = Array<StandardEntry<TAttributes>>;
export type StandardResponse<TData, TMeta> = WithData<TData> & WithMeta<TMeta>;
