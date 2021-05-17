export type OptionsDefaults = {
  maxDate: string;
  autoOpenTab: boolean;
  pollingInterval: number;
  isPaused: boolean;
};

export const defaults: OptionsDefaults = {
  maxDate: "2021-12-31",
  autoOpenTab: true,
  pollingInterval: 5,
  isPaused: false,
};
