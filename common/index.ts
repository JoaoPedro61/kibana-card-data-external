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

export const PLUGIN_ID = 'kbn_bst_etn';
export const PLUGIN_NAME = 'kbn_bst_etn';

export const ALLOWED_INPUT = {
  data: {
    value: `[REQUIRED](any): Value that will be shown`,
    labels: `[OPTIONAL](boolean): Hide labels`,
    label: `[OPTIONAL](string): Label that will be shown`,
    subText: `[OPTIONAL](string): SubText that will be shown`,
    prefix: `[OPTIONAL](string): Prefix that will be shown`,
    sufix: `[OPTIONAL](string): Suffix that will be shown`,
    background: `[OPTIONAL](string): Background to be applied to the card body`,
    valueColor: `[OPTIONAL](string): Color that will be applied to the returned value`,
    descriptorsColor: `[OPTIONAL](string): Color to be applied to card labels`,
  }
};

export { get } from './api';
export { merge } from './deep-merge';
export { equals } from './equals';
export { addQueryParams, isValid } from './url';
export { requestErrors } from './erros';
export { tryToInt } from './try-to-int';
export { isAColor } from './color';
