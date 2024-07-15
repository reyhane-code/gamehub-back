
export interface getGamesQuery {
  perPage?: number;
  page?: number;
  genreId?: number;
  platformId?: number;
  order?: string;
  search?: string;
}
