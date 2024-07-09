import { Like } from "models/like.model";
import { Repositories } from "src/enums/database.enum";

export const likesProviders = [
  {
    provide: Repositories.LIKES,
    useValue: Like,
  },
];
