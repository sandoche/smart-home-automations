import { Controller, Get } from '@nestjs/common';

@Controller()
export class WebappController {
  @Get()
  getHello(): any {
    return {
      test: 'Hello World!',
    };
  }
}
