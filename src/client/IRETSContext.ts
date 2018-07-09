export interface IRetsContext {
    header: { [key: string]: string };
    method: 'search';
    queryOptions: IRetsQueryOptions;
}
