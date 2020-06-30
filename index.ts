import { resolve } from 'path';
import { Legacy } from './../../kibana';

import { LegacyPluginApi, LegacyPluginInitializer } from '../../src/legacy/types';

import { PLUGIN_ID, PLUGIN_NAME } from './common/index';



const kbnBstEtnVisPluginInitializer: LegacyPluginInitializer = ({ Plugin }: LegacyPluginApi) =>
  new Plugin({
    id: PLUGIN_ID,
    name: PLUGIN_NAME,
    require: ['kibana', 'elasticsearch'],
    publicDir: resolve(__dirname, 'public'),
    uiExports: {
      visTypes: [
        `plugins/${PLUGIN_NAME}/legacy`
      ],
      hacks: [
        resolve(__dirname, 'public/legacy')
      ],
      injectDefaultVars: server => ({}),
    },
    init: (server: Legacy.Server) => ({}),
    config(Joi: any) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },
  } as Legacy.PluginSpecOptions);

// eslint-disable-next-line import/no-default-export
export default kbnBstEtnVisPluginInitializer;
