import { GameFile } from 'models/game_file.model';
import { Repository } from 'src/enums/database.enum';

export const filesProviders = [
  {
    provide: Repository.GAME_FILES,
    useValue: GameFile,
  },
];
