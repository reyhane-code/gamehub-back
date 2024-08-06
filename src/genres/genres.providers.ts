import { Genre } from "models/genre.model";
import { Repository } from "src/enums/database.enum";

export const genresProviders = [
  {
    provide: Repository.GENRES,
    useValue: Genre,
  },
];
