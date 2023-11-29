import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LightsCron } from './lights.cron';
import { LightsService } from './lights.service';
import { ScheduleModule } from '@nestjs/schedule';
import { LightsController } from './lights.controller';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot()],
  providers: [LightsService, LightsCron],
  controllers: [LightsController],
  exports: [LightsService, LightsCron],
})
export class AutomationsModule {}
