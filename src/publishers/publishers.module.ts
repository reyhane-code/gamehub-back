import { Module } from "@nestjs/common";
import { PublishersController } from "./publishers.controller";
import { PublishersService } from "./publishers.service";
import { publishersProviders } from "./publishers.providers";

@Module({
  controllers: [PublishersController],
  providers: [PublishersService, ...publishersProviders],
})
export class PublishersModule {}
