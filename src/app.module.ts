import { Module } from '@nestjs/common';
import { AutomationsModule } from './automations/automations.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), AutomationsModule],
})
export class AppModule {}
