import { Injectable } from '@nestjs/common';
import { ArticlesService } from 'src/articles/articles.service';
import { FilterOperationEnum } from 'src/enums/enums';
import { GamesService } from 'src/games/games.service';

@Injectable()
export class SearchService {
    constructor(
        private readonly gamesService: GamesService,
        private readonly articlesService: ArticlesService,

    ) { }

    async searchInSearchables(searchText: string, query: { page: number, perPage: number }) {
        const articlesResult = await this.articlesService.findArticlesWithPaginate({
            page: query.page,
            perPage: query.perPage,
            search: [
                {
                    field: 'title',
                    operation: FilterOperationEnum.ILIKE,
                    value: `%${searchText}%`
                }
            ]
        })

        const gamesResult = await this.gamesService.findGamesWithPaginate({
            page: query.page,
            perPage: query.perPage,
            search: [
                {
                    field: 'name',
                    operation: FilterOperationEnum.ILIKE,
                    value: `%${searchText}%`
                }
            ]
        })

        return {
            items: {
                articles: articlesResult.items,
                games: gamesResult.items,
            }
        }
    }
}
