import { Like } from "models/like.model";
import { Repository } from "src/enums/database.enum";

export const likesProviders = [
  {
    provide: Repository.LIKES,
    useValue: Like,
  },
];
