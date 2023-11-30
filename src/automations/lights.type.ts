export type light = {
  type: 'hue' | 'wiz';
  isOn: () => Promise<boolean>;
  on: () => Promise<void>;
  off: () => Promise<void>;
  reset: () => Promise<void>;
  changeBrightnessTemperatureColor: (
    brightness: number,
    temperature: number,
    color?: `#${string}`,
  ) => Promise<void>;
};

export type lights = light[];
