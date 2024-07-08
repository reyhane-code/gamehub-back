import { Genre } from "models/genre.model";
import { Repositories } from "src/enums/database.enum";

export const genresProviders = [
  {
    provide: Repositories.GENRES,
    useValue: Genre,
  },
];
