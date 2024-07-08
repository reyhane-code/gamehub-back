import { Module } from "@nestjs/common";
import { PlatformsController } from "./platforms.controller";
import { PlatformsService } from "./platforms.service";
import { platformsProviders } from "./platforms.providers";

@Module({
  controllers: [PlatformsController],
  providers: [PlatformsService, ...platformsProviders],
})
export class PlatformsModule {}
