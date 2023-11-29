import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LightsService } from './lights.service';

@Injectable()
export class LightsCron {
  private readonly logger = new Logger('LightsCron', {
    timestamp: true,
  });

  constructor(private readonly lightsService: LightsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async morningCron() {
    this.logger.debug('Resetting lights');
    await this.lightsService.reset();
  }

  @Cron(CronExpression.EVERY_DAY_AT_8PM)
  async afternoonCron() {
    this.logger.debug('Dimming lights');
    await this.lightsService.dimmed();
  }
}
