import { Injectable, Logger } from '@nestjs/common';
import { api, discovery } from 'node-hue-api';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LightsService {
  private readonly logger = new Logger('LightsService', {
    timestamp: true,
  });

  private hueLights = [];

  constructor(private readonly configService: ConfigService) {}

  async turnOffLights() {
    this.logger.debug('Turning off lights');

    const hueApi = await discovery
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

    const hueLights = await hueApi.lights.getAll();

    for (const light of hueLights) {
      await hueApi.lights.setLightState(light.id, {
        on: true,
      });
    }
  }
}
