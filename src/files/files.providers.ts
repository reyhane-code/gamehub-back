import { GameFile } from 'models/game_file.model';
import { Repositories } from 'src/enums/database.enum';

export const filesProviders = [
  {
    provide: Repositories.GAME_FILES,
    useValue: GameFile,
  },
];
