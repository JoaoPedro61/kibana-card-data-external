import { ExpressionFunction } from './../../../src/plugins/interpreter/public';
import { Context, Arguments, Return } from './types';

import { PLUGIN_NAME_VIS_FN } from './../common';


export const visFn = (): ExpressionFunction<
  typeof PLUGIN_NAME_VIS_FN,
  Context,
  Arguments,
  Return
> => ({
  PLUGIN_NAME_VIS_FN,
  type: 'render',
  context: {
    types: ['kibana_datatable'],
  },
  help: `Brisanet External Data`,
  args: {
    labels: {
      types: ['boolean'],
      default: true,
      help: 'Shows labels under the metric values.',
    },
    font: {
      types: ['style'],
      help: 'Font settings.',
      default: '{font size=60}',
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
      default: '""',
      help: 'URI Target.',
    },
  },
  fn(context: Context, args: Arguments) {
    const fontSize = Number.parseInt(args.font.spec.fontSize, 10);
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
            fontSize
          }
        },
        params: {
          listenOnChange: true,
        },
      },
    };
  },
});
