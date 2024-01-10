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

type Entry<TAttributes> = WithId & WithAttributes<TAttributes>;
type Entries<TAttributes> = Array<Entry<TAttributes>>;
type StrapiResponse<TData, TMeta> = WithData<TData> & WithMeta<TMeta>;