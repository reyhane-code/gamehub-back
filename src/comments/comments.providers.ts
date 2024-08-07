import { Comment } from 'models/comment.model';
import { Repository } from 'src/enums/database.enum';

export const commentsProviders = [
  {
    provide: Repository.COMMENTS,
    useValue: Comment,
  },
];
