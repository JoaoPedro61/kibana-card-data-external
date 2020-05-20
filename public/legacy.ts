import { PluginInitializerContext } from '../../../src/core/public';
import { npSetup, npStart } from 'ui/new_platform';
import {
  setup as visualizationsSetup
} from './../../../src/legacy/core_plugins/visualizations/public/np_ready/public/legacy';
import { KbnBstEtnPluginSetupDependencies } from './types';
import { plugin } from '.';



const plugins: Readonly<KbnBstEtnPluginSetupDependencies> = {
  expressions: npSetup.plugins.expressions,
  visualizations: visualizationsSetup,
  data: npSetup.plugins.data,
};

const pluginInstance = plugin({} as PluginInitializerContext);

export const setup = pluginInstance.setup(npSetup.core, plugins);
export const start = pluginInstance.start(npStart.core);
