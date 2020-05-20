import { PLUGIN_NAME, PLUGIN_ID } from './../common';

import { OptionsComponent, VisComponent } from './components';



export const visTypeDefinition = (_deps?: any) => {
  return {
    id: PLUGIN_ID,
    name: PLUGIN_NAME,
    title: 'Brisanet External',
    icon: 'globe',
    description: 'Take a predefined data in a route from the Brisanet database and present it in Kibana in the form of visualization.',
    visConfig: {
      component: VisComponent,
      defaults: {
        uriTarget: ``,
        type: `metric`,
        label: `Change Me`,
        subText: `This is my simple help text.`,
        labels: true,
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
