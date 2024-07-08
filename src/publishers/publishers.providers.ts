import { Publisher } from "models/publisher.model";
import { Repositories } from "src/enums/database.enum";

export const publishersProviders = [
  {
    provide: Repositories.PUBLISHERS,
    useValue: Publisher,
  },
];
