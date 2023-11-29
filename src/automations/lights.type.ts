export type light = {
  type: 'hue' | 'wiz';
  on: () => Promise<void>;
  off: () => Promise<void>;
  reset?: () => Promise<void>;
  changeBrightnessAndTemperature?: (
    brightness: number,
    temperature: number,
  ) => Promise<void>;
};

export type lights = light[];
