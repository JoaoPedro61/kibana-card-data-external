import { PluginInitializerContext } from '../../../src/core/public';
import { KbnBstEtnPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.



export function plugin(initializerContext: PluginInitializerContext) {
  return new KbnBstEtnPlugin(initializerContext);
}

export { KbnBstEtnPluginSetup, KbnBstEtnPluginStart } from './types';
