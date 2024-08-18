import { Op } from 'sequelize';
import { Model } from 'sequelize-typescript';
import { paginationDefault } from 'src/constance';
import { SortOperation } from 'src/enums/enums';
import {
  IPaginationQueryOptions,
  ISearchFilterOptions,
} from 'src/interfaces/database.interfaces';

const operationMap = {
  EQ: Op.eq,
  NE: Op.ne,
  GT: Op.gt,
  LT: Op.lt,
  GTE: Op.gte,
  LTE: Op.lte,
  LIKE: Op.like,
};

export const toSlug = (str: string) => {
  return str.toLowerCase().replace(/\s+/g, '-');
};
export const getSearchAndFilter = (
  filter: ISearchFilterOptions[],
  model: any,
) => {
  if (!filter) {
    return { whereConditions: [], include: [] }; // Return an empty object with the expected structure
  }

  const whereConditions: any[] = [];
  const include: any[] = [];

  filter.forEach(({ field, operation, value }) => {
    const operationFunc = operationMap[operation];
    if (!operationFunc) return;

    if (field.includes('.')) {
      const [relation, nestedField] = field.split('.');
      include.push({
        model: model.associations[relation].target,
        where: {
          [nestedField]: { [operationFunc]: value },
        },
      });
    } else {
      whereConditions.push({ [field]: { [operationFunc]: value } });
    }
  });

  return { whereConditions, include };
};

export const getOrderClause = (order: string | undefined): string => {
  if (!order) {
    return '';
  }
  const isDescending = order.startsWith('-');
  const columnName = isDescending ? order.slice(1) : order;

  return `${columnName} ${isDescending ? SortOperation.DESC : SortOperation.ASC}`;
};

export const generatePaginationQuery = (
  query: IPaginationQueryOptions,
  model: any,
) => {
  const perPage = query.perPage ?? paginationDefault.perPage;
  const page = query.page ?? paginationDefault.page;
  const orderClause = query.order ? getOrderClause(query.order) : null;
  const { include, whereConditions } = getSearchAndFilter(query.filter, model);

  return {
    page,
    perPage,
    order: orderClause,
    whereConditions,
    include,
  };
};
