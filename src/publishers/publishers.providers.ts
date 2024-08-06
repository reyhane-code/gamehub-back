import { Publisher } from "models/publisher.model";
import { Repository } from "src/enums/database.enum";

export const publishersProviders = [
  {
    provide: Repository.PUBLISHERS,
    useValue: Publisher,
  },
];
