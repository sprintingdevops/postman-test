import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getArray(): number[] {
    return [1, 2, 3];
  }

  getObject(): Record<string, string> {
    return { foo: 'bar', baz: '12' };
  }
}
