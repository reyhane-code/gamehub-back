import { OperationPositionEnum } from 'src/enums/enums';
import { SearchFilterOptions } from 'src/interfaces/database.interfaces';

export const toSlug = (str: string) => {
  return str.toLowerCase().replace(/\s+/g, '-');
};
export const setWhereQuery = (
  operation: string,
  options: SearchFilterOptions[],
) => {
  const query = options
    .map((item) => `${item.field} ${item.operation} ${item.value}`)
    .join(operation === OperationPositionEnum.FILTER ? ' AND ' : ' OR ');

  return operation === OperationPositionEnum.SEARCH ||
    operation === OperationPositionEnum.FILTER
    ? query
    : '';
};
