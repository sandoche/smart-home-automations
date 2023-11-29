import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LightsService } from './lights.service';

@Injectable()
export class LightsCron {
  private readonly logger = new Logger('LightsService', {
    timestamp: true,
  });

  constructor(private readonly lightsService: LightsService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {}
}
