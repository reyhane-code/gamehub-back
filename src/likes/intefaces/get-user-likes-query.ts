import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';

export interface IGetUseLikesQuery extends IPaginationQueryOptions {
  expand?: string;
}
