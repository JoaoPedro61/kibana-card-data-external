import { PLUGIN_NAME, PLUGIN_ID } from './../common/index';

import { OptionsComponent, VisComponent } from './components';


export const visTypeDefinition = (_deps?: any) => {
  return {
    id: PLUGIN_ID,
    name: PLUGIN_NAME,
    title: 'External Metric',
    icon: 'visMetric',
    description: 'Take a predefined data in a route from the Brisanet abase and present it in Kibana in the form of visualization.',
    requiresUpdateStatus: [`params`, `PARAMS`],
    params: {
      listenOnChange: true,
    },
    visConfig: {
      component: VisComponent,
      defaultSize: `medium`,
      defaults: {
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
        }
      },
    },
    editorConfig: {
      optionsTemplate: OptionsComponent
    },
    responseHandler: 'none',
    requestHandler: 'none',
  };
};
