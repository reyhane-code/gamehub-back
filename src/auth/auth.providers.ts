import { User } from 'models/user.model';
import { Repositories } from 'src/enums/database.enum';

export const authProviders = [
  {
    provide: Repositories.USERS,
    useValue: User,
  },
];
