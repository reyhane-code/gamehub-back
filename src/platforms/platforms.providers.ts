import { Platform } from "models/platform.model";
import { Repository } from "src/enums/database.enum";

export const platformsProviders = [
  {
    provide: Repository.PLATFORMS,
    useValue: Platform,
  },
];
