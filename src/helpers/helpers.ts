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
  params: ISearchFilterOptions[],
  model: any,
  joinOperator: string,
) => {
  if (!params || params.length === 0) {
    return { whereConditions: '', include: [] }; // Return an empty object with the expected structure
  }

  const whereConditions: any[] = [];
  const include: any[] = [];

  params.forEach(({ field, operation, value }) => {
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

  const whereConditionsString = generateCondition(
    whereConditions,
    joinOperator,
  );

  return { whereConditions: whereConditionsString, include };
};

const generateCondition = (items: any[], joinOperator: string) => {
  return items
    .map((item) => {
      const [field] = Object.keys(item);
      const operation = Object.keys(item[field])[0];
      const value = item[field][operation];

      const formattedValue = formatValue(value);

      return `${field} ${operation} ${formattedValue}`;
    })
    .join(` ${joinOperator} `);
};

const formatValue = (value: any) => {
  if (value === null) {
    return 'NULL';
  } else if (Array.isArray(value)) {
    return `(${value.map((v) => (typeof v === 'string' ? `'${v}'` : v)).join(', ')})`;
  } else if (typeof value === 'string') {
    return `'${value}'`;
  } else if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }
  return value; // For numbers and other types
};

export const getsortByClause = (sortBy: string | undefined): string => {
  if (!sortBy) {
    return '';
  }
  const isDescending = sortBy.startsWith('-');
  const columnName = isDescending ? sortBy.slice(1) : sortBy;

  return `${columnName} ${isDescending ? SortOperation.DESC : SortOperation.ASC}`;
};

export const generatePaginationQuery = (
  query: IPaginationQueryOptions,
  model: any,
) => {
  const perPage = query.perPage ?? paginationDefault.perPage;
  const page = query.page ?? paginationDefault.page;
  const sortByClause = query.sortBy ? getsortByClause(query.sortBy) : null;

  let filterInclude = [];
  let filterConditions = '';
  let searchInclude = [];
  let searchConditions = '';

  if (query.filter) {
    const filterResult = getSearchAndFilter(query.filter, model, 'AND');
    filterInclude = filterResult.include;
    filterConditions = filterResult.whereConditions;
  }

  if (query.search) {
    const searchResult = getSearchAndFilter(query.search, model, 'OR');
    searchInclude = searchResult.include;
    searchConditions = searchResult.whereConditions;
  }
  let whereConditions = '';
  if (filterConditions && searchConditions) {
    whereConditions = `${filterConditions} AND ${searchConditions}`;
  } else if (filterConditions) {
    whereConditions = filterConditions;
  } else if (searchConditions) {
    whereConditions = searchConditions;
  }
  return {
    page,
    perPage,
    sortBy: sortByClause,
    whereConditions: whereConditions.trim() ?? '',
    include: [...searchInclude, ...filterInclude] ?? [],
  };
};
