import { File } from 'models/file.model';
import { Game } from 'models/game.model';
import { GenreGame } from 'models/genre_game.model';
import { PlatformGame } from 'models/platform_game.model';
import { PublisherGame } from 'models/publisher_game.model';
import { Repository } from 'src/enums/database.enum';

export const gamesProviders = [
  {
    provide: Repository.GAMES,
    useValue: Game,
  },
  {
    provide: Repository.PLATFORM_GAMES,
    useValue: PlatformGame,
  },
  {
    provide: Repository.PUBLISHER_GAMES,
    useValue: PublisherGame,
  },
  {
    provide: Repository.GENRE_GAMES,
    useValue: GenreGame,
  },
  {
    provide: Repository.FILES,
    useValue: File,
  },
];
