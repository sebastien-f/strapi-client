type WithId = {
    id: number;
}

type WithAttributes<TAttributes> = {
    attributes: TAttributes;
}

type WithError = {

}

type WithMeta<TMeta> = {
    meta:TMeta;
}

type WithData<TData> = {
    data:TData;
}

type StrapiStandardEntry<TAttributes> = WithId & WithAttributes<TAttributes>;
type StrapiStandardEntriesData<TAttributes> = Array<StrapiStandardEntry<TAttributes>>;
type StrapiStandardResponse<TData, TMeta> = WithData<TData> & WithMeta<TMeta>;