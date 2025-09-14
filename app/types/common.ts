export type Category = {
    id: number;
    code: string;
    description?: string; 
    createdAt: Date;
    updatedAt: Date;
}

export type PaginationMeta = {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number; 
}

export type PaginationRequestParam = {
    page: {
        number: number;
        size: number;
    },
    filter : {
        [key:string] : string | boolean | number | null
    },
    sort: string
}  

export type Permission = {
    id: number | string;
    name: string;
};