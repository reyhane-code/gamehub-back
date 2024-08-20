export enum SortOperation {
  DESC = 'DESC',
  ASC = 'ASC',
}
export enum FilterOperationEnum {
  //! any list
  IN = 'IN',
  NOT_IN = 'NOT IN',
  BETWEEN = 'BETWEEN',
  NOT_BETWEEN = 'NOT BETWEEN',
  //! any
  EQ = '=',
  GT = '>',
  GTE = '>=',
  LT = '<',
  LTE = '<=',
  NE = '<>',
  //! string
  LIKE = 'LIKE',
  ILIKE = 'ILIKE',
  IREGEXP = 'IREGEXP',
  NOT_ILIKE = 'NOT_ILIKE',
  NOT_IREGEXP = 'NOT_IREGEXP',
  NOT_LIKE = 'NOT_LIKE',
  REGEXP = 'REGEXP',
  NOT_REGEXP = 'NOT_REGEXP',
  //! NULL | bool
  IS = 'IS',
  NOT = 'NOT',
  ELM_MTC = 'ELM_MTC',
}
export enum OperationPositionEnum {
  FILTER = 'filter',
  SEARCH = 'search',
}
