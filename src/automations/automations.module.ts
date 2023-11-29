import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LightsCron } from './lights.cron';
import { LightsService } from './lights.service';

@Module({
  imports: [ConfigModule],
  providers: [LightsService, LightsCron],
  exports: [LightsService, LightsCron],
})
export class AutomationsModule {}
