import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @Get('/:searchText')
    searchInSearchables(@Param('searchText') searchText: string, @Query() query: { page: number, perPage: number }) {
        return this.searchService.searchInSearchables(searchText, query)
    }

}
