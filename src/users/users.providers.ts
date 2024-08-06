import { User } from 'models/user.model';
import { Repository } from 'src/enums/database.enum';

export const usersProviders = [
  {
    provide: Repository.USERS,
    useValue: User,
  },
];
