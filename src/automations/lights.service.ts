import { Injectable, Logger } from '@nestjs/common';
import { api, discovery } from 'node-hue-api';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LightsService {
  private readonly logger = new Logger('LightsService', {
    timestamp: true,
  });

  private hueApi = null;
  private hueLights = [];

  constructor(private readonly configService: ConfigService) {
    this.initHue();
  }

  async initHue() {
    this.logger.debug('Initializing Hue');
    this.hueApi = await discovery
      .nupnpSearch()
      .then((searchResults) => {
        const host = searchResults[0].ipaddress;
        return api
          .createLocal(host)
          .connect(this.configService.get('HUE_USER'));
      })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    this.hueLights = await this.hueApi.lights.getAll();
    this.logger.debug(`Found ${this.hueLights.length} hue lights`);
  }

  async turnOff() {
    this.logger.debug('Turning off lights');

    for (const light of this.hueLights) {
      await this.hueApi.lights.setLightState(light.id, {
        on: false,
      });
    }
  }
}
