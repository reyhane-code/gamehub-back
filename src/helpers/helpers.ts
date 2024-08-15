import { or } from 'sequelize';
import { paginationDefault } from 'src/constance';
import { SortOperation } from 'src/enums/enums';
import {
  IPaginationQueryOptions,
  ISearchFilterOptions,
  ISearchFilterParam,
} from 'src/interfaces/database.interfaces';

export const toSlug = (str: string) => {
  return str.toLowerCase().replace(/\s+/g, '-');
};
export const setWhereQuery = (params: ISearchFilterParam) => {
  if (!params) {
    return '';
  }
  let query = '';

  if (params.filter.length >= 1) {
    query += generateCondition(params.filter, 'AND');
  }

  if (params.search.length >= 1) {
    const searchQuery = generateCondition(params.search, 'OR');
    query += query && searchQuery ? ` AND (${searchQuery})` : searchQuery;
  }

  return query;
};
const generateCondition = (
  items: ISearchFilterOptions[],
  joinOperator: string,
) => {
  return items
    .map((item) => `${item.field} ${item.operation} ${item.value}`)
    .join(` ${joinOperator} `);
};

export const getOrderClause = (order: string | undefined): string => {
  if (!order) {
    return '';
  }
  const isDescending = order.startsWith('-');
  const columnName = isDescending ? order.slice(1) : order;

  return `${columnName} ${isDescending ? SortOperation.DESC : SortOperation.ASC}`;
};

export const generatePaginationQuery = (query: IPaginationQueryOptions) => {
  const perPage = query.perPage ?? paginationDefault.perPage;
  const page = query.page ?? paginationDefault.page;
  const order = query.order ? getOrderClause(query.order) : null;
  const where = query.where ? setWhereQuery(query.where) : '';
  return {
    page,
    perPage,
    order,
    where,
  };
};
