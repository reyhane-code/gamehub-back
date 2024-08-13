import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { filesProviders } from './files.providers';

@Module({
  controllers: [FilesController],
  providers: [FilesService, ...filesProviders],
  exports: [FilesService],
})
export class FilesModule {}
