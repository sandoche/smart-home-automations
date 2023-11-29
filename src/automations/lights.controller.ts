import { Controller, Get } from '@nestjs/common';
import { LightsService } from './lights.service';

@Controller('lights')
export class LightsController {
  constructor(private readonly lightsService: LightsService) {}

  @Get('/off')
  async off(): Promise<{ status: string }> {
    await this.lightsService.turnOff();

    return {
      status: 'success',
    };
  }
}
