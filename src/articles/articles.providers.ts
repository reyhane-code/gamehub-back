import { Article } from 'models/article.model';
import { File } from 'models/file.model';
import { Repository } from 'src/enums/database.enum';

export const articlesProviders = [
  {
    provide: Repository.ARTICLES,
    useValue: Article,
  },
  {
    provide: Repository.FILES,
    useValue: File,
  },
];
