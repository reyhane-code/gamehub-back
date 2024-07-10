export interface getGamesQuery {
  perPage?: number;
  page?: number;
  genreId?: number;
  platformId?: number;
  ordering?: string;
  search?: string;
}
