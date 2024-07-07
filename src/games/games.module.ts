import { Module } from "@nestjs/common";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";
import { gamesProviders } from "./games.providers";

@Module({
  controllers: [GamesController],
  providers: [GamesService, ...gamesProviders],
})
export class GamesModule {}
