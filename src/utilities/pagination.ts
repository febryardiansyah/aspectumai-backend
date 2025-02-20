type PaginationData<T> = {
  total: number;
  results: T[];
};

type PaginationResult<T> = {
  current_page: number;
  total_page: number;
  total_records: number;
  records: T[];
};

export default class PaginationUtils {
  static calculateOffset(limit: number, page: number): number {
    return (page > 0 ? page - 1 : 0) * limit;
  }

  static validatePaginationQuery(query: Record<string, any>): {
    limit: number;
    page: number;
  } {
    let limit = parseInt(query.limit, 10) || 10;
    let page = parseInt(query.page, 10) || 1;

    if (limit <= 0) limit = 10;
    if (page <= 0) page = 1;

    return { limit, page };
  }

  static pagination<T>(
    data: PaginationData<T>,
    current_page: number = 1,
    limit: number = 10
  ): PaginationResult<T> {
    const total_page = Math.ceil(data.total / limit);
    const total_records = data.total;
    const records = data.results;

    return {
      current_page,
      total_page,
      total_records,
      records,
    };
  }
}
