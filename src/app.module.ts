import { Module } from '@nestjs/common';
import { AutomationsModule } from './automations/automations.module';
import { ConfigModule } from '@nestjs/config';
import { WebappModule } from './webapp/webapp.module';

@Module({
  imports: [ConfigModule.forRoot(), AutomationsModule, WebappModule],
})
export class AppModule {}
