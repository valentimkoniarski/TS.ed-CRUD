export class Page<T> {
  total: number;
  offset: number;
  results: T[];
  page: number;
  pageSize: number;
  totalPages: number;

  constructor(params: {
    total: number;
    offset: number;
    results: T[];
    page: number;
    pageSize: number;
    totalPages: number;
  }) {
    this.total = params.total;
    this.offset = params.offset;
    this.results = params.results;
    this.page = params.page;
    this.pageSize = params.pageSize;
    this.totalPages = params.totalPages;
  }
}
