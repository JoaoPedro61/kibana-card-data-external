export const PLUGIN_ID = `kbn-bst-etn`;
export const PLUGIN_NAME = `kbn-bst-etn`;
export const PLUGIN_NAME_VIS_FN = `kbn-bst-etn-vis`;

export const ALLOWED_INPUT = {
  data: {
    value: `[REQUIRED](any): Value that will be shown`,
    labels: `[OPTIONAL](boolean): Hide labels`,
    label: `[OPTIONAL](string): Label that will be shown`,
    subText: `[OPTIONAL](string): SubText that will be shown`,
    prefix: `[OPTIONAL](string): Prefix that will be shown`,
    sufix: `[OPTIONAL](string): Sufix that will be shown`,
  }
};



export { get } from './api';

export * from './requests-error';

export * from './equals';

export * from './valid-url';
