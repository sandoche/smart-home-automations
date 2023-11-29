import { Injectable, Logger } from '@nestjs/common';
import { api, discovery } from 'node-hue-api';
import { ConfigService } from '@nestjs/config';
import { discover, SCENES } from 'wikari';
import type { lights } from './lights.type';

@Injectable()
export class LightsService {
  private readonly logger = new Logger('LightsService', {
    timestamp: true,
  });

  private hueApi = null;
  private hueLights = [];

  private lights: lights = [];

  constructor(private readonly configService: ConfigService) {
    this.init();
  }

  async init() {
    // this.logger.debug('Initializing Hue');
    // this.hueApi = await discovery
    //   .nupnpSearch()
    //   .then((searchResults) => {
    //     const host = searchResults[0].ipaddress;
    //     return api
    //       .createLocal(host)
    //       .connect(this.configService.get('HUE_USER'));
    //   })
    //   .catch((err) => {
    //     this.logger.error(err);
    //     return null;
    //   });

    // this.hueLights = await this.hueApi.lights.getAll();
    // this.logger.debug(`Found ${this.hueLights.length} hue lights`);

    const wizLights = await discover({ addr: '192.168.68.255' });

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

    // for (const light of this.hueLights) {
    //   await this.hueApi.lights.setLightState(light.id, {
    //     on: false,
    //   });
    // }

    for (const light of this.lights) {
      await light.off();
    }
  }

  async turnOn() {
    this.logger.debug('Turning on lights');

    // for (const light of this.hueLights) {
    //   await this.hueApi.lights.setLightState(light.id, {
    //     on: true,
    //   });
    // }

    for (const light of this.lights) {
      await light.on();
    }
  }
}
