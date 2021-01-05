/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


import { VisComponent } from './components/visualization';
import { OptionsComponent } from './components/options';

import { tryToInt } from './../../common';

import { Schemas } from '../../../../src/plugins/vis_default_editor/public';
import { ExpressionsStart } from '../../../../src/plugins/expressions/public';
import { VisualizationsSetup } from '../../../../src/plugins/visualizations/public';
import { DataPublicPluginStart, AggGroupNames } from '../../../../src/plugins/data/public';




export interface kbnBstEtnPluginVisualizationDeps {
  [x: string]: any;
  expressions: ExpressionsStart;
  data: DataPublicPluginStart;
  visualizations: VisualizationsSetup;
}

export const DEFAULT_VIS_CONFIG = {
	uriTarget: `https://jsonplaceholder.cypress.io/todos/1`,
  type: `metric`,
  label: `Change Me`,
  subText: `This is my simple help text.`,
  labels: true,
  prefix: ``,
  sufix: ``,
  allowReplacePropsByRequestResponse: false,
  allowInheritPropsByRequestResponse: false,
  style: {
    fontSize: 60,
    background: `inherit`,
    valueColor: `inherit`,
    descriptorsColor: `inherit`,
  }
};


export function renderVis(id: string, name: string, deps: kbnBstEtnPluginVisualizationDeps): void {
  const _fac = () => ({
    name,
    type: 'render',
    inputTypes: ['kibana_datatable'],
    help: `Brisanet External Data`,
    args: {
      labels: {
        types: ['boolean'],
        default: true,
        help: 'Shows labels under the metric values.',
      },
      prefix: {
        types: ['string'],
        default: `""`,
        help: 'Prefix of the metric value',
      },
      sufix: {
        types: ['string'],
        default: `""`,
        help: 'Sufix of the metric value',
      },
      allowInheritPropsByRequestResponse: {
        types: ['boolean'],
        default: false,
        help: 'Inherit some properties from the request response',
      },
      allowReplacePropsByRequestResponse: {
        types: ['boolean'],
        default: false,
        help: 'Replace some properties from the request response',
      },
      font: {
        types: ['style'],
        help: 'Font settings.',
        default: '{font size=60}',
      },
      background: {
        types: ['style'],
        help: 'Background card settings.',
        default: '{background="inherit"}',
      },
      valueColor: {
        types: ['style'],
        help: 'Color value settings.',
        default: '{color="inherit"}',
      },
      descriptorsColor: {
        types: ['style'],
        help: 'Color descriptors settings.',
        default: '{color="inherit"}',
      },
      subText: {
        types: ['string'],
        aliases: ['description'],
        default: '""',
        help: 'Custom text to show under the metric.',
      },
      label: {
        types: ['string'],
        aliases: ['label', 'text'],
        default: '""',
        help: 'Name of the metric.',
      },
      uriTarget: {
        types: ['string'],
        aliases: ['target', 'uri'],
        default: '"https://jsonplaceholder.cypress.io/todos/1"',
        help: 'URI Target.',
      },
    },
    fn(context: any, args: any) {
      const fontSize = tryToInt(args.font.spec.fontSize, 60);
      const background = args.font.spec.background || 'inherit';
      const valueColor = args.font.spec.valueColor || 'inherit';
      const descriptorsColor = args.font.spec.descriptorsColor || 'inherit';
      return {
        type: 'render',
        as: 'visualization',
        value: {
          visData: context,
          visType: 'metric',
          visConfig: {
            uriTarget: args.uriTarget,
            labels: args.labels,
            label: args.label,
            subText: args.subText,
            style: {
              fontSize,
              background,
              valueColor,
              descriptorsColor,
            }
          },
          params: {
            listenOnChange: true,
          },
        },
      };
    },
  });

  const _def = () => ({
    id,
    name,
    type: 'render',
    title: 'External Metric',
    icon: 'visMetric',
    description: 'Take a predefined data in a route from the Brisanet abase and present it in Kibana in the form of visualization.',
    visConfig: {
      defaultSize: `medium`,
      defaults: { ...DEFAULT_VIS_CONFIG },
      component: VisComponent
    },
    editorConfig: {
      optionsTemplate: OptionsComponent,
      // Comment this to allow take a index to work
      //
      schemas: new Schemas([
        {
          group: AggGroupNames.Metrics,
          name: 'metric',
          title: 'Metric',
          aggFilter: ['!geo_centroid', '!geo_bounds'],
          aggSettings: {
            top_hits: {
              allowStrings: true,
            },
          },
          min: 1,
          defaults: [{ type: 'count', schema: 'metric' }],
        },
      ]),
    },
    // Comment this to allow take a index to work
    // responseHandler: 'none',
    // requestHandler: 'none',
  });

  try {
    (deps.expressions as any).registerFunction(_fac);
  } catch (_) {
    console.log('_', _);
  }

  deps.visualizations.createReactVisualization(_def());
}
