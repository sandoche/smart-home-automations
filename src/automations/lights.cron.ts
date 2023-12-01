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

  @Cron(CronExpression.EVERY_DAY_AT_7PM)
  async afternoonCronFirst() {
    this.logger.debug('Dimming lights');
    await this.lightsService.update(50, 2000, '#FE8714');
  }

  @Cron(CronExpression.EVERY_DAY_AT_8PM)
  async afternoonCronSecond() {
    this.logger.debug('Dimming lights');
    await this.lightsService.update(40, 1750, '#FE8714');
  }

  @Cron(CronExpression.EVERY_DAY_AT_9PM)
  async afternoonCronThird() {
    this.logger.debug('Dimming lights');
    await this.lightsService.update(30, 1500, '#FE8714');
  }

  @Cron(CronExpression.EVERY_DAY_AT_10PM)
  async afternoonCronForth() {
    this.logger.debug('Dimming lights');
    await this.lightsService.update(20, 1000, '#FE8714');
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async afternoonCronFifth() {
    this.logger.debug('Dimming lights');
    await this.lightsService.update(10, 1000, '#FE8714');
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async updatesListOfWiz() {
    this.logger.debug('Updating list of Wiz lights');
    await this.lightsService.setupWizLights();
  }
}
