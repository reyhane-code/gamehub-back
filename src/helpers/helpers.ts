import { Op, Sequelize } from 'sequelize';
import { Model } from 'sequelize-typescript';
import { paginationDefault } from 'src/constance';
import { FilterOperationEnum, SortOperation } from 'src/enums/enums';
import {
  IPaginationQueryOptions,
  ISearchFilterOptions,
} from 'src/interfaces/database.interfaces';
import * as qs from 'qs';

export const toSlug = (str: string) => {
  return str.toLowerCase().replace(/\s+/g, '-');
};
export const getSearchAndFilter = (
  params: ISearchFilterOptions[],
  model: any,
  joinOperator: string,
) => {
  if (!params) {
    return { whereConditions: '', include: [] }; // Return an empty object with the expected structure
  }

  const whereConditions: any[] = [];
  const include: any[] = [];

  params.forEach(({ field, operation, value }) => {
    // const operationFunc = FilterOperationEnum[operation];
    // if (!operationFunc) return;

    console.log('ruuun', FilterOperationEnum[operation], operation);
    if (field.includes('.')) {
      const [relation, nestedField] = field.split('.');
      const modelValue =
        model.associations[relation]?.target ??
        model.associations[relation + 's']?.target;
      if (!modelValue) return;
      include.push({
        model: modelValue,
        where: Sequelize.literal(
          `${field} ${FilterOperationEnum[operation]} ${value}`,
        ),
      });
    } else {
      whereConditions.push({
        field,
        operation: FilterOperationEnum[operation],
        value,
      });
    }
  });

  const whereConditionsString = generateCondition(
    whereConditions,
    model,
    joinOperator,
  );

  return { whereConditions: whereConditionsString, include };
};

const generateCondition = (
  items: any[],
  model: any,
  joinOperator: string,
): string => {
  return items
    .map(({ field, value, operation }) => {
      const formattedValue = formatValue(value);
      return `"${model.name}"."${field}" ${operation} ${formattedValue}`;
    })
    .join(` ${joinOperator} `);
};

const formatValue = (value: any) => {
  if (value === null) {
    return 'NULL';
  } else if (Array.isArray(value)) {
    return `(${value.map((v) => (typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v)).join(', ')})`;
  } else if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'`; // Escape single quotes in strings
  } else if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }
  return value; // For numbers and other types
};

export const getSortByClause = (sortBy: string | undefined): string => {
  if (!sortBy) {
    return '';
  }
  const isDescending = sortBy.startsWith('-');
  const columnName = isDescending ? sortBy.slice(1) : sortBy;

  return `${columnName} ${isDescending ? SortOperation.DESC : SortOperation.ASC}`;
};

export const generatePaginationQuery = (
  queryValue: IPaginationQueryOptions,
  model: any,
) => {
  // @ts-ignore
  const query = qs.parse(queryValue, {
    allowDots: true,
  }) as IPaginationQueryOptions;
  const perPage = query.perPage ?? paginationDefault.perPage;
  const page = query.page ?? paginationDefault.page;
  const sortByClause = query.sortBy ? getSortByClause(query.sortBy) : null;

  let filterInclude = [];
  let searchInclude = [];
  let filterConditions = '';
  let searchConditions = '';

  if (query.filter) {
    const filterResult = getSearchAndFilter(query.filter, model, 'AND');
    filterInclude = filterResult.include ?? [];
    filterConditions = filterResult.whereConditions;
  }

  if (query.search) {
    const searchResult = getSearchAndFilter(query.search, model, 'OR');
    searchInclude = searchResult.include ?? [];
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
    include: [...searchInclude, ...filterInclude],
  };
};

export const expandHandler = (expand: string, model: any) => {
  const associations = expand.split(',');
  return associations.map((item) => ({
    model: model.associations[`${item}`].target,
  }));
};


