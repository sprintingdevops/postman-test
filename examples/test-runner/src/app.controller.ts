import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

class PersonDto {
  name: string;
  age: number;
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/arr')
  getArray(): number[] {
    return this.appService.getArray();
  }

  @Get('/obj')
  getObject(): Record<string, string> {
    return this.appService.getObject();
  }

  @Post('/person')
  createUser(@Body() person: PersonDto): Record<string, string> {
    console.log('Person:', person);
    return this.appService.getObject();
  }
}
