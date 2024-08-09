import { File } from 'models/file.model';
import { Repository } from 'src/enums/database.enum';

export const filesProviders = [
  {
    provide: Repository.FILES,
    useValue: File,
  },
];
