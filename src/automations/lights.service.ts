import { Injectable, Logger } from '@nestjs/common';
import { api, discovery } from 'node-hue-api';
import { ConfigService } from '@nestjs/config';
import { discover } from 'wikari';
import type { lights } from './lights.type';

@Injectable()
export class LightsService {
  private readonly logger = new Logger('LightsService', {
    timestamp: true,
  });

  private lights: lights = [];

  constructor(private readonly configService: ConfigService) {
    this.init();
  }

  async init() {
    this.logger.debug('Initializing Hue');
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

    if (!hueApi) {
      this.logger.error('Failed to initialize Hue');
      return;
    }

    const hueLights = await hueApi.lights.getAll();
    this.logger.debug(`Found ${hueLights.length} hue lights`);

    for (const light of hueLights) {
      this.lights.push({
        type: 'hue',
        on: async () => {
          await hueApi.lights.setLightState(light.id, {
            on: true,
          });
        },
        off: async () => {
          await hueApi.lights.setLightState(light.id, {
            off: true,
          });
        },
      });
    }

    const wizLights = await discover({ addr: '192.168.68.255' });
    this.logger.debug(`Found ${wizLights.length} wiz lights`);

    for (const light of wizLights) {
      this.lights.push({
        type: 'wiz',
        on: async () => {
          await light.turn(true);
        },
        off: async () => {
          await light.turn(false);
        },
      });
    }
  }

  async turnOff() {
    this.logger.debug('Turning off lights');

    for (const light of this.lights) {
      await light.off();
    }
  }

  async turnOn() {
    this.logger.debug('Turning on lights');

    for (const light of this.lights) {
      await light.on();
    }
  }
}
