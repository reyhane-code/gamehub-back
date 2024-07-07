import { Game } from "models/game.model";
import { Repositories } from "src/enums/database.enum";

export const gamesProviders = [
  {
    provide: Repositories.GAMES,
    useValue: Game,
  },
];
