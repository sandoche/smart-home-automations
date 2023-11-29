import { Controller, Get } from '@nestjs/common';
import { LightsService } from './lights.service';
import { Logger } from '@nestjs/common';

@Controller('lights')
export class LightsController {
  private readonly logger = new Logger('LightsController', {
    timestamp: true,
  });

  constructor(private readonly lightsService: LightsService) {}

  @Get('/off')
  async off(): Promise<{ status: string }> {
    this.logger.debug('/off called');
    await this.lightsService.turnOff();

    return {
      status: 'success',
    };
  }
}
