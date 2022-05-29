import {Injectable} from '@nestjs/common';
import {ExampleResponseDto} from './app.dto';

@Injectable()
export class AppService {
  getHello() {
    return new ExampleResponseDto();
  }
}
