import { Bookmark } from 'models/bookmark.model';
import { Repository } from 'src/enums/database.enum';

export const bookmarksProviders = [
  {
    provide: Repository.BOOKMARKS,
    useValue: Bookmark,
  },
];
