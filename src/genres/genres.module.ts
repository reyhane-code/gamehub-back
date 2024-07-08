import { Module } from "@nestjs/common";
import { GenresController } from "./genres.controller";
import { GenresService } from "./genres.service";
import { genresProviders } from "./genres.providers";

@Module({
  controllers: [GenresController],
  providers: [GenresService, ...genresProviders],
})
export class GenresModule {}
