import { Platform } from "models/platform.model";
import { Repositories } from "src/enums/database.enum";

export const platformsProviders = [
  {
    provide: Repositories.PLATFORMS,
    useValue: Platform,
  },
];
