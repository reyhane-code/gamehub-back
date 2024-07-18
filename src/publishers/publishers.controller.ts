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
import { PublishersService } from './publishers.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { AddPublisherDto } from './dtos/add-publisher.dto';
import { UpdatePublisherDto } from './dtos/update-publisher.dto';

@Controller('publishers')
export class PublishersController {
  constructor(private publisherService: PublishersService) {}

  @Get('/:id')
  findPublisher(@Param('id') id: number) {
    return this.publisherService.findOneById(id);
  }

  @Get()
  findpublisher() {
    return this.publisherService.findAll();
  }

  @Get('/paginate')
  findpublisherWithPaginate(@Query() query: paginationQueryOptions) {
    return this.publisherService.findAllWithPaginate(query);
  }

  @UseGuards(AdminGuard)
  @Get('/user')
  findUserPublishers(@CurrentUser() user: UserInterface) {
    return this.publisherService.findUserPublishers(user);
  }

  @UseGuards(AdminGuard)
  @Post()
  addPublisher(
    @Body() body: AddPublisherDto,
    @CurrentUser() user: UserInterface,
  ) {
    return this.publisherService.addPublisher(body, user);
  }

  @UseGuards(AdminGuard)
  @Put('/:id')
  updatePublisher(@Param('id') id: number, @Body() body: UpdatePublisherDto) {
    return this.publisherService.updatePublisher(id, body);
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  deletePublisher(@Param('id') id: number, isSoftDelete: boolean = true) {
    return this.publisherService.deletePublisher(id, isSoftDelete);
  }
}
