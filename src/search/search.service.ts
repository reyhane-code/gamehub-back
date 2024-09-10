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

    async searchInSearchables(searchText: string) {
        const articlesResult = await this.articlesService.findArticlesWithPaginate({
            search: [
                {
                    field: 'title',
                    operation: FilterOperationEnum.ILIKE,
                    value: `%${searchText}%`
                }
            ]
        })

        const gamesResult = await this.gamesService.findGamesWithPaginate({
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
