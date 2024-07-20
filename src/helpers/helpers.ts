import { OperationPositionEnum } from 'src/enums/enums';
import {
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
