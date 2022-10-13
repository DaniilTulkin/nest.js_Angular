import { User } from "./user.interface";

export interface UserData {
    docs: User[];
    totalDocs: number;
    limit: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    page: number;
    totalPages: number;
    offset: number;
    prevPage: number;
    nextPage: number;
    pagingCounter: number;
    meta: any;
}