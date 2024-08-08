import { Article } from 'models/article.model';
import { ArticleFile } from 'models/article_file';
import { Repository } from 'src/enums/database.enum';

export const articlesProviders = [
  {
    provide: Repository.ARTICLES,
    useValue: Article,
  },
  {
    provide: Repository.ARTICLE_FILES,
    useValue: ArticleFile,
  },
];
