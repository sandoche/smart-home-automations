export type light = {
  type: 'hue' | 'wiz';
  on: () => Promise<void>;
  off: () => Promise<void>;
};

export type lights = light[];
