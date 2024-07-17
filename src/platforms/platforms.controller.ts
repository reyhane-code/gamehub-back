import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { paginationQueryOptions } from 'src/interfaces/database.interfaces';
import { PlatformsService } from './platforms.service';
import { paginationDefault } from 'src/constance';
import { AdminGuard } from 'src/guards/admin.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { AddPlatformDto } from './dtos/add-platform.dto';
import { UpdatedPlatformDto } from './dtos/update-platform.dto';

@Controller('platform')
export class PlatformsController {
  constructor(private platformsService: PlatformsService) {}

  @Get('/:id')
  findPlatform(@Param('id') id: number) {
    return this.platformsService.findOneById(id);
  }

  @Get()
  findplatforms() {
    return this.platformsService.findAll();
  }
  @Get('/paginate')
  findplatformsWithPaginate(
    @Query() query: paginationQueryOptions = paginationDefault,
  ) {
    return this.platformsService.findAllWithPaginate(query);
  }

  @UseGuards(AdminGuard)
  @Get('/user')
  findUserPlatforms(@CurrentUser() user: UserInterface) {
    return this.platformsService.findUserPlatforms(user);
  }

  @UseGuards(AdminGuard)
  @Post()
  addPlatform(
    @Body() body: AddPlatformDto,
    @CurrentUser() user: UserInterface,
  ) {
    return this.platformsService.addPlatform(body, user);
  }

  @UseGuards(AdminGuard)
  @Put('/:id')
  updatePlatform(@Param('id') id: number, @Body() body: UpdatedPlatformDto) {
    return this.platformsService.updatePlatform(id, body);
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  deletePlatform(
    @Param('id') id: number,
    @Query() isSoftDelete: boolean = true,
  ) {
    return this.platformsService.deletePlatform(id, isSoftDelete);
  }
}
