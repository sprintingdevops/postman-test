import {Controller, Get} from '@nestjs/common';
import {ApiResponse} from '@nestjs/swagger';
import {ExampleResponseDto} from './app.dto';
import {AppService} from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
    type: ExampleResponseDto,
  })
  @ApiResponse({status: 403, description: 'Forbidden.'})
  getHello() {
    return this.appService.getHello();
  }
}
