import { Pagination } from "src/types/Pagination";

export interface ICRUD<DTO,T> {
    create(item: DTO): Promise<boolean>;
    list({ page, pageSize,orderBy,order }: {
        page?: number;
        pageSize?: number;
        orderBy?: string;
        order?: string;
    }): Promise<Pagination<T>>
    update(item: T): Promise<boolean> ;
    delete(id: string): Promise<boolean>;
    read(id: string): Promise<T | null>;
}
