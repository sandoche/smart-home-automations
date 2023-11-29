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
  private hueApi;

  constructor(private readonly configService: ConfigService) {
    this.init();
  }

  async init() {
    this.logger.debug('Initializing Wiz');
    const wizLights = await discover({ addr: '192.168.68.255' });

    for (const light of wizLights) {
      this.lights.push({
        type: 'wiz',
        isOn: async () => {
          const pilot = await light.getPilot();
          const isOn = pilot.result.state;
          return isOn;
        },
        on: async () => {
          await light.turn(true);
        },
        off: async () => {
          await light.turn(false);
        },
        reset: async () => {
          await light.brightness(100);
          await light.white(2900);
        },
        changeBrightnessTemperatureColor: async (
          brightness,
          temperature,
          color,
        ) => {
          await light.brightness(brightness);
          await light.white(temperature);

          if (color) {
            try {
              await light.color(color);
              this.logger.debug(`Changed color to ${color}`);
            } catch (err) {
              this.logger.error(err);
            }
          }
        },
      });
    }

    this.logger.debug(`Found ${wizLights.length} wiz lights`);

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

    if (!this.hueApi) {
      this.logger.error('Failed to initialize Hue');
      return;
    }

    const hueLights = await this.hueApi.lights.getAll();

    for (const light of hueLights) {
      this.lights.push({
        type: 'hue',
        on: async () => {
          console.log('===========');
          console.log(light.id);
          await this.hueApi.lights.setLightState(light.id, {
            on: true,
          });
        },
        off: async () => {
          console.log('===========');
          console.log(light.id);
          await this.hueApi.lights.setLightState(light.id, {
            off: true,
          });
        },
      });
    }
    this.logger.debug(`Found ${hueLights.length} hue lights`);
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

  async dimmed() {
    this.logger.debug('Dimming lights');

    for (const light of this.lights) {
      // only resets if the lamp is on
      const isOn = await light.isOn();
      if (!isOn) {
        return;
      }

      await light.changeBrightnessTemperatureColor(30, 1000);
    }
  }

  async reset() {
    this.logger.debug('Resetting lights');

    for (const light of this.lights) {
      // only resets if the lamp is on
      const isOn = await light.isOn();
      if (!isOn) {
        return;
      }

      await light.reset();
    }
  }
}
