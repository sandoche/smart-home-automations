import { Module } from '@nestjs/common';
import { AutomationsModule } from './automations/automations.module';

@Module({
  imports: [AutomationsModule],
})
export class AppModule {}
