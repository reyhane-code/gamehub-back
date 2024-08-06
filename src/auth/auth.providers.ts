import { User } from 'models/user.model';
import { Repository } from 'src/enums/database.enum';

export const authProviders = [
  {
    provide: Repository.USERS,
    useValue: User,
  },
];
