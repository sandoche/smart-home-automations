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
    this.logger.debug('/lights/off called');
    await this.lightsService.turnOff();

    return {
      status: 'success',
    };
  }

  @Get('/on')
  async on(): Promise<{ status: string }> {
    this.logger.debug('/lights/on called');
    await this.lightsService.turnOn();

    return {
      status: 'success',
    };
  }

  @Get('/reset')
  async reset(): Promise<{ status: string }> {
    this.logger.debug('/lights/reset called');
    await this.lightsService.reset();

    return {
      status: 'success',
    };
  }

  @Get('/lights/update/:brightness/:temperature/:color')
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

  @Get('/test')
  async test(): Promise<{ status: string }> {
    this.logger.debug('/lights/test called');

    await this.lightsService.turnOn();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await this.lightsService.reset();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await this.lightsService.update(50, 2000, '#FE8714');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await this.lightsService.update(40, 1750, '#FE8714');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await this.lightsService.update(30, 1500, '#FE8714');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await this.lightsService.update(20, 1000, '#FE8714');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await this.lightsService.reset();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await this.lightsService.turnOff();

    return {
      status: 'success',
    };
  }
}
