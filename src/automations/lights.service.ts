import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LightsService {
  private readonly logger = new Logger('LightsService', {
    timestamp: true,
  });

  constructor() {}
}
