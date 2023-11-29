import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LightsCron } from './lights.cron';
import { LightsService } from './lights.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot()],
  providers: [LightsService, LightsCron],
  exports: [LightsService, LightsCron],
})
export class AutomationsModule {}
