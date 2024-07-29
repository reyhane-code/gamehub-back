import { Controller, Get, Query, Res } from '@nestjs/common';
import { GetFileQueryDto } from './dtos/get-file-query.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get()
  async getFile(
    @Res({ passthrough: true }) res,
    @Query() query: GetFileQueryDto,
  ) {
    return this.filesService.readAndSetFileProperties(query, res);
  }
}
