import { Plugin as ExpressionsPublicPlugin } from './../../../src/plugins/expressions/public';
import { Plugin as DataPublicPlugin } from '../../../src/plugins/data/public';
import { VisualizationsSetup } from 'plugins/visualizations';
import { KibanaDatatable, Render, Style } from './../../../src/plugins/interpreter/public';



// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface KbnBstEtnPluginSetupDependencies {
  data: ReturnType<DataPublicPlugin['setup']>;
  visualizations: VisualizationsSetup;
  expressions: ReturnType<ExpressionsPublicPlugin['setup']>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface KbnBstEtnPluginSetup { }

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface KbnBstEtnPluginStart {}

export type Context = KibanaDatatable;

export interface Arguments {
  type: string;
  uriTarget: string;
  label: string;
  subText: string;
  labels: boolean;
  fontSize: number;
  font: Style;
}

export interface VisParams {
  type: Arguments['type'];
  label: Arguments['label'];
  subText: Arguments['subText'];
  labels: Arguments['labels'];
  style: {
    fontSize: Arguments['fontSize'];
  };
}

export interface RenderValue {
  visType: 'metric';
  visData: Context;
  visConfig: VisParams;
  params: any;
}

export type Return = Render<RenderValue>;
