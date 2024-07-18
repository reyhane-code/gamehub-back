import { Game } from 'models/game.model';
import { GenreGame } from 'models/genre_game.model';
import { PlatformGame } from 'models/platform_game.model';
import { PublisherGame } from 'models/publisher_game.model';
import { Repositories } from 'src/enums/database.enum';

export const gamesProviders = [
  {
    provide: Repositories.GAMES,
    useValue: Game,
  },
  {
    provide: Repositories.PLATFORM_GAMES,
    useValue: PlatformGame,
  },
  {
    provide: Repositories.PUBLISHER_GAMES,
    useValue: PublisherGame,
  },
  {
    provide: Repositories.GENRE_GAMES,
    useValue: GenreGame,
  },
];
