import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
} from '../../../src/core/public';

import { KbnBstEtnPluginSetup, KbnBstEtnPluginStart, KbnBstEtnPluginSetupDependencies } from './types';

import { visFn } from './vis_fn';
import { visTypeDefinition } from './vis_type';



export class KbnBstEtnPlugin implements Plugin<KbnBstEtnPluginSetup, KbnBstEtnPluginStart> {
  public initializerContext!: PluginInitializerContext;

  constructor(initializerContext: PluginInitializerContext) {
    this.initializerContext = initializerContext as any;
  }

  public setup(core: CoreSetup, { expressions, visualizations }: KbnBstEtnPluginSetupDependencies) {
    expressions.registerFunction(visFn);

    visualizations.createReactVisualization(visTypeDefinition());

    return {};
  }

  public start(core: CoreStart) {
    return {};
  }

  public stop() {}

}
