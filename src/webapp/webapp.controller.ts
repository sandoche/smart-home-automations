import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class WebappController {
  @Get()
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }
}
