export type GetAllParams = {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  type?: string;
};