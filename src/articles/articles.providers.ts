import { Article } from 'models/article.model';
import { Repository } from 'src/enums/database.enum';

export const articlesProviders = [
  {
    provide: Repository.ARTICLES,
    useValue: Article,
  },
];
