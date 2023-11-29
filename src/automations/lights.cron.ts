import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LightsService } from './lights.service';

@Injectable()
export class LightsCron {
  private readonly logger = new Logger('LightsCron', {
    timestamp: true,
  });

  constructor(private readonly lightsService: LightsService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    this.logger.debug('Turning off lights');
    await this.lightsService.turnOffLights();
  }
}
