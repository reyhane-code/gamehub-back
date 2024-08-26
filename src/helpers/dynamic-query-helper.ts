import { WhereOptions, Op, Model } from 'sequelize';
import { FilterOperationEnum, SortOperation } from 'src/enums/enums';
import { paginationDefault } from 'src/constance';
import { inspect } from 'util';
import * as qs from 'qs';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { BadRequestException } from '@nestjs/common';

// Helper function to map operations
const mapOperation = (operation: FilterOperationEnum) => {
  switch (operation) {
    case FilterOperationEnum.EQ:
      return Op.eq;
    case FilterOperationEnum.GT:
      return Op.gt;
    case FilterOperationEnum.GTE:
      return Op.gte;
    case FilterOperationEnum.LT:
      return Op.lt;
    case FilterOperationEnum.LTE:
      return Op.lte;
    case FilterOperationEnum.NE:
      return Op.ne;
    case FilterOperationEnum.LIKE:
      return Op.like;
    case FilterOperationEnum.ILIKE:
      return Op.iLike;
    case FilterOperationEnum.IN:
      return Op.in;
    case FilterOperationEnum.NOT_IN:
      return Op.notIn;
    // Add other cases as needed
    default:
      throw new BadRequestException(`Unsupported operation: ${operation}`);
  }
};

// Function to handle dynamic search, filter, pagination, and sortBying
export const buildQueryOptions = (queryVal: any, model: typeof Model) => {
  const query = qs.parse(queryVal, {
    allowDots: true,
  }) as IPaginationQueryOptions;


  // Handle search and filter
  const searchConditions: WhereOptions[] = [];
  const filterConditions: WhereOptions[] = [];
  let filterInclude = [];
  let searchInclude = [];
  let where = {}
  let page = query.page ?? paginationDefault.page
  let perPage = query.perPage ?? paginationDefault.perPage
  let sortBy = query.sortBy ?? undefined

  console.log(query.search, 'search')
  console.log(query.filter, 'filter')
  if (query.search) {
    const searches = Array.isArray(query.search) ? query.search : [query.search];
    searches.forEach((search) => {
      const { field, operation, value } = search;
      if (field && operation && value !== undefined) {
        const op = mapOperation(operation as FilterOperationEnum);
        if (field.includes('.')) {
          const [relation, nestedField] = field.split('.');
          const modelValue =
            model.associations[relation]?.target ??
            model.associations[relation + 's']?.target;
          console.log(modelValue, 'modelVal')
          if (!modelValue) return;
          searchInclude.push({
            model: modelValue,
            where: { [nestedField]: { [op]: value } }
          });
        } else
          searchConditions.push({ [field]: { [op]: value } });
      }
    });
  }

  if (query.filter) {
    const filters = Array.isArray(query.filter) ? query.filter : [query.filter];
    filters.forEach((filter) => {
      const { field, operation, value } = filter;
      if (field && operation && value !== undefined) {
        const op = mapOperation(operation as FilterOperationEnum);
        if (field.includes('.')) {
          const [relation, nestedField] = field.split('.');
          const modelValue =
            model.associations[relation]?.target ??
            model.associations[relation + 's']?.target;
          if (!modelValue) return;
          filterInclude.push({
            model: modelValue,
            where: { [nestedField]: { [op]: value } }
          });
        } else
          filterConditions.push({ [field]: { [op]: value } });
      }
    });
  }

  console.log(searchConditions, 'searchconditions')
  console.log(filterConditions, 'filterconditions')
  // Combine search and filter conditions with AND between search and filter, OR within each
  if (searchConditions.length > 0 && filterConditions.length > 0) {
    where = {
      [Op.and]: [
        { [Op.or]: searchConditions },
        { [Op.and]: filterConditions },
      ],
    };
  } else if (searchConditions.length > 0) {
    where = { [Op.or]: searchConditions };
  } else if (filterConditions.length > 0) {
    where = { [Op.and]: filterConditions };
  }
  console.log(where, 'where')

  // Handle sortBying
  if (sortBy) {
    const isDescending = sortBy.startsWith('-');
    const columnName = isDescending ? sortBy.slice(1) : sortBy;

    sortBy = `${columnName} ${isDescending ? SortOperation.DESC : SortOperation.ASC}`;

  }

  const include = filterInclude.concat(searchInclude)
  console.log(inspect(include))
  return {
    page,
    perPage,
    limit: perPage,
    offset: (page - 1) * perPage,
    include,
    sortBy,
    where

  }
};