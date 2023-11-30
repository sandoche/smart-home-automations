import { Controller, Get, Param } from '@nestjs/common';
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

  @Get('/on')
  async on(): Promise<{ status: string }> {
    this.logger.debug('/on called');
    await this.lightsService.turnOn();

    return {
      status: 'success',
    };
  }

  @Get('/reset')
  async reset(): Promise<{ status: string }> {
    this.logger.debug('/reset called');
    await this.lightsService.reset();

    return {
      status: 'success',
    };
  }

  @Get('/update/:brightness/:temperature/:color')
  async update(
    @Param('brightness') brightness: string,
    @Param('temperature') temperature: string,
    @Param('color') color: string,
  ): Promise<{ status: string }> {
    this.logger.debug('/update/:brightness/:temperature/:color called', {
      brightness,
      temperature,
      color,
    });

    await this.lightsService.update(
      parseInt(brightness),
      parseInt(temperature),
      `#${color}`,
    );

    return {
      status: 'success',
    };
  }
}
