import { Pagination } from "src/types/Pagination";

export interface ICRUD<DTO,T> {
    create(item: DTO): Promise<boolean>;
    list({ page, pageSize, }: {
        page?: number;
        pageSize?: number;
    }): Promise<Pagination<T>>
    update(item: T): Promise<boolean> ;
    delete(id: string): Promise<boolean>;
    read(id: string): Promise<T | null>;
}
