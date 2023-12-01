import { Module } from '@nestjs/common';
import { WebappController } from './webapp.controller';

@Module({
  controllers: [WebappController],
})
export class WebappModule {}
