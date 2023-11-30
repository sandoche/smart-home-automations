import { Injectable, Logger } from '@nestjs/common';
import { api, discovery, v3 } from 'node-hue-api';
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
    this.setupWizLights();
    this.setupHueLights();
  }

  async setupWizLights() {
    this.logger.debug('Setting up Wiz');
    const wizLights = await discover({
      addr: this.configService.get('IP_GATEWAY'),
    });

    for (const light of wizLights) {
      const existingLight = this.lights.find(
        (l) => l.id === light.macIdentifier,
      );
      if (!existingLight) {
        this.lights.push({
          id: light.macIdentifier,
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            color,
          ) => {
            await light.brightness(brightness);
            await light.white(temperature);

            // if (color) {
            //   try {
            //     await light.color(color);
            //     this.logger.debug(`Changed color to ${color}`);
            //   } catch (err) {
            //     this.logger.error(err);
            //   }
            // }
          },
        });
      }
    }

    this.logger.debug(`Found ${wizLights.length} wiz lights`);
    this.logger.debug(`Total amount of lights: ${this.lights.length}`);
  }

  async setupHueLights() {
    this.logger.debug('Setting up Hue');
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

    for (const light of hueLights) {
      const existingLight = this.lights.find((l) => l.id === light.id);
      if (!existingLight) {
        this.lights.push({
          id: light.id,
          type: 'hue',
          on: async () => {
            await hueApi.lights.setLightState(light.id, {
              on: true,
            });
          },
          off: async () => {
            await hueApi.lights.setLightState(light.id, {
              on: false,
            });
          },
          isOn: async () => {
            const state = await hueApi.lights.getLightState(light.id);
            return state.on;
          },
          reset: async () => {
            await hueApi.lights.setLightState(light.id, {
              bri: 254,
              ct: 366,
            });
          },
          changeBrightnessTemperatureColor: async (
            brightness,
            temperature,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            color,
          ) => {
            const state = new v3.lightStates.LightState();

            const convertedTemperature = -0.077111 * temperature + 654.222;

            state.brightness(brightness);
            state.ct(Math.min(Math.max(convertedTemperature, 153), 500));

            // const hexCode = color.replace('#', '');
            // const r = parseInt(hexCode.substring(0, 2), 16);
            // const g = parseInt(hexCode.substring(2, 4), 16);
            // const b = parseInt(hexCode.substring(4, 6), 16);
            // const rbg = [r, g, b];
            // state.rgb(rbg);

            await hueApi.lights.setLightState(light.id, state);
          },
        });
      }
    }
    this.logger.debug(`Found ${hueLights.length} hue lights`);
    this.logger.debug(`Total amount of lights: ${this.lights.length}`);
  }

  async turnOff() {
    this.logger.debug('Turning off lights');

    for (const light of this.lights) {
      try {
        await light.off();
      } catch (err) {
        this.logger.error(err);
      }
    }
  }

  async turnOn() {
    this.logger.debug('Turning on lights');

    for (const light of this.lights) {
      try {
        await light.on();
      } catch (err) {
        this.logger.error(err);
      }
    }
  }

  async update(brightness: number, temperature: number, color?: `#${string}`) {
    this.logger.debug('Dimming lights');

    for (const light of this.lights) {
      // only update if the lamp is on
      const isOn = await light.isOn();
      if (!isOn) {
        return;
      }
      try {
        await light.changeBrightnessTemperatureColor(
          brightness,
          temperature,
          color,
        );
      } catch (err) {
        this.logger.error(err);
      }
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
      try {
        await light.reset();
      } catch (err) {
        this.logger.error(err);
      }
    }
  }
}
