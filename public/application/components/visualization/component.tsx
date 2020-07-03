import React, { Fragment, useEffect, useState } from 'react';

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingSpinner,
  EuiText,
  EuiSpacer,
  EuiEmptyPrompt,
  EuiTitle,
} from '@elastic/eui';

import {
  equals,
  isValid,
  get as letItGo,
  requestErrors,
  addQueryParams,
  isAColor,
  tryToInt
} from './../../../../common';

import { getDataService } from './../../../services';

import { take } from 'rxjs/operators';



export function Component({ visParams, visData }) {

  const [shouldIgnoreFirst, set_shouldIgnoreFirst] = useState(true);

  const [isLoading, set_isLoading]  = useState(isValid(visParams.uriTarget));

  const [shouldHidePrefixAndSufix, set_shouldHidePrefixAndSufix]  = useState(false);

  const [validURI, set_validURI]  = useState(isValid(visParams.uriTarget));

  const [data_error, set_data_error]  = useState(`noErros`);

  const [data_display, set_data_display]  = useState<any>(`?`);

  const [uriTarget, set_uriTarget]  = useState(visParams.uriTarget);

  const [labels, set_labels]  = useState(visParams.labels);

  const [label, set_label]  = useState(visParams.label);

  const [prefix, set_prefix]  = useState(visParams.prefix);

  const [subText, set_subText]  = useState(visParams.subText);

  const [sufix, set_sufix]  = useState(visParams.sufix);

  const [allowInheritPropsByRequestResponse, set_allowInheritPropsByRequestResponse]  = useState(visParams.allowInheritPropsByRequestResponse);

  const [allowReplacePropsByRequestResponse, set_allowReplacePropsByRequestResponse]  = useState(visParams.allowReplacePropsByRequestResponse);

  const [style, set_style]  = useState(visParams.style);

  const [supliedStyleCard, set_supliedStyleCard]  = useState({
    background: `${(isAColor(style.background, 'inherit') || 'inherit')}`,
  });

  const [supliedStyle, set_supliedStyle]  = useState({
    fontSize: `${(tryToInt(style.fontSize, 60))}pt`,
    color: `${(isAColor(style.valueColor, 'inherit') || 'inherit')}`,
    fontWeight: 700
  });

  const [supliedStyleDescriptors, set_supliedStyleDescriptors]  = useState({
    color: `${(isAColor(style.descriptorsColor, 'inherit') || 'inherit')}`,
  });

  useEffect(() => {
    let didCancel = false;

    if (!didCancel) {
      if (!shouldIgnoreFirst) {
        set_validURI(isValid(visParams.uriTarget));
        set_uriTarget(visParams.uriTarget);
        _fetchMetadata();
      }
    }

    return () => {
      didCancel = true;
    }
  }, [visData]);

  function _fetchMetadata(): void {
    if (!validURI) {
      if (isLoading) {
        set_isLoading(false);
      }
    } else {
      if (!isLoading) {
        set_isLoading(true);
      }
      const c_styles = {...style};
      const fnAssertStyles = (key: string) => {
        return (value: any) => {
          c_styles[key] = value;
          set_style(c_styles);
          set_supliedStyleCard({
            background: `${(isAColor(c_styles.background, 'inherit') || 'inherit')}`,
          });
          set_supliedStyleDescriptors({
            color: `${(isAColor(c_styles.descriptorsColor, 'inherit') || 'inherit')}`,
          });
          set_supliedStyle({
            ...supliedStyle,
            fontSize: `${(tryToInt(c_styles.fontSize, 60))}pt`,
            color: `${(isAColor(c_styles.valueColor, 'inherit') || 'inherit')}`,
          });
        };
      };
      const assert: Partial<any> = {
        labels: [labels, set_labels, `boolean`],
        label: [label, set_label, `string`],
        subText: [subText, set_subText, `string`],
        prefix: [prefix, set_prefix, `string`],
        sufix: [sufix, set_sufix, `string`],

        background: [style.background, fnAssertStyles('background'), `string`],
        valueColor: [style.valueColor, fnAssertStyles('valueColor'), `string`],
        descriptorsColor: [style.descriptorsColor, fnAssertStyles('descriptorsColor'), `string`],
      };

      const superData = getDataService();
      const uri = addQueryParams(visParams.uriTarget, {
        ...visData,
        timeRange: superData.query.timefilter.timefilter.getTime(),
        filters: JSON.parse(JSON.stringify([...(superData.query.filterManager.getFilters() || [])])) }, [ ]);
      letItGo(uri)
        .pipe(take(1))
        .subscribe((response) => {
          if (!response.hasOwnProperty(`data`)) {
            set_data_error(`malformationDataResponse`);
            set_shouldHidePrefixAndSufix(true);
          } else {
            if (`object` !== typeof response.data) {
              set_data_error(`malformationDataResponse`);
              set_shouldHidePrefixAndSufix(true);
            } else {
              if (!response.data.hasOwnProperty(`value`)) {
                set_data_error(`malformationDataResponse`);
              } else {
                if (response.data.value) {
                  set_data_error(`noErros`);
                  set_shouldHidePrefixAndSufix(false);
                  set_data_display(response.data.value);
                } else {
                  set_data_display(`?`);
                  set_shouldHidePrefixAndSufix(true);
                }
                const shouldContinue = allowReplacePropsByRequestResponse || allowInheritPropsByRequestResponse;
                if (shouldContinue) {
                  for (const k in response.data) {
                    if (k !== `value`) {
                      if (assert.hasOwnProperty(k)) {
                        const [value, modifier, type] = assert[k];
                        if (type === typeof response.data[k]) {
                          if (allowReplacePropsByRequestResponse) {
                            modifier(response.data[k]);
                          } else {
                            if (allowInheritPropsByRequestResponse) {
                              if (type === `boolean`) {
                                modifier(response.data[k]);
                              } else if (type === `string`) {
                                if (!value || !value.length) {
                                  if (value !== response.data[k]) {
                                    modifier(response.data[k]);
                                  }
                                }
                              }
                            }
                          }
                        } else {
                          throw new Error(`Receiving invalid type property in the data returned from the request. Property "${k}", expect type ${type}, but got ${typeof response.data[k]}.`);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          set_isLoading(false);
        }, (error) => {
          set_data_error(error.statusName);
          set_data_display(``);
          set_isLoading(false);
        });
    }
  }

  useEffect(() => {
    let didCancel = false;
    if (!didCancel) {
      if (visParams.uriTarget !== uriTarget) {
        set_validURI(isValid(visParams.uriTarget));
        set_uriTarget(visParams.uriTarget);
        _fetchMetadata();
      }
      if (visParams.labels !== labels) {
        set_labels(visParams.labels);
      }
      if (visParams.label !== label) {
        set_label(visParams.label);
      }
      if (visParams.prefix !== prefix) {
        set_prefix(visParams.prefix);
      }
      if (visParams.subText !== subText) {
        set_subText(visParams.subText);
      }
      if (visParams.sufix !== sufix) {
        set_sufix(visParams.sufix);
      }
      if (visParams.allowInheritPropsByRequestResponse !== allowInheritPropsByRequestResponse) {
        set_allowInheritPropsByRequestResponse(visParams.allowInheritPropsByRequestResponse);
      }
      if (visParams.allowReplacePropsByRequestResponse !== allowReplacePropsByRequestResponse) {
        set_allowReplacePropsByRequestResponse(visParams.allowReplacePropsByRequestResponse);
      }
      if (!equals(visParams.style, style)) {
        set_style(visParams.style);
        set_supliedStyleCard({
          background: `${(isAColor(style.background, 'inherit') || 'inherit')}`,
        });
        set_supliedStyleDescriptors({
          color: `${(isAColor(style.descriptorsColor, 'inherit') || 'inherit')}`,
        });
        set_supliedStyle({
          ...supliedStyle,
          fontSize: `${(tryToInt(style.fontSize, 60))}pt`,
          color: `${(isAColor(style.valueColor, 'inherit') || 'inherit')}`,
        });
      }
    }
    return () => {
      didCancel = true;
    };
  }, [visParams]);

  useEffect(() => {
    if (validURI) {
      _fetchMetadata();
    }
    set_shouldIgnoreFirst(false);
  }, []);

  let prefixFragment = (<></>);

  if (shouldHidePrefixAndSufix ? false : prefix && prefix.length) {
    prefixFragment = (
      <EuiFlexItem grow={false}>
        {prefix}
      </EuiFlexItem>
    );
  }

  let sufixFragment = (<></>);

  if (shouldHidePrefixAndSufix ? false : sufix && sufix.length) {
    sufixFragment = (
      <EuiFlexItem grow={false}>
        {sufix}
      </EuiFlexItem>
    );
  }

  let labelsFragment = (<></>);

  if (data_error !== "noErros" ? false : labels) {
    let labelFragment = (<></>);
    
    if (label && label.length) {
      labelFragment = (
        <EuiFlexGroup justifyContent="center" alignItems="center">
          <EuiFlexItem grow={false}>
            {label}
          </EuiFlexItem>
        </EuiFlexGroup>
      );
    }

    let subTextFragment = (<></>);
    
    if (subText && subText.length) {
      subTextFragment = (
        <EuiFlexGroup justifyContent="center" alignItems="center">
          <EuiFlexItem  grow={false}>
            <EuiText color="subdued">
              {subText}
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      );
    }
    
    labelsFragment = (
      <Fragment>
        <EuiSpacer size="l" />
        <div style={
          !isLoading && validURI && data_error === `noErros` 
            ? supliedStyleDescriptors
            : {}
        }>
          {labelFragment}
          {subTextFragment}
        </div>
      </Fragment>
    );
  }

  let dataFragment = (<></>);

  if (data_error === `noErros`) {
    dataFragment = (
      <EuiFlexItem grow={false}>
        {data_display}
      </EuiFlexItem>
    );
  } else {
    let error;
    if (requestErrors.hasOwnProperty(data_error)) {
      error = (requestErrors as any)[data_error];
    } else {
      error = {
        title: `Opss...`,
        message: `Desculpe, ocorreu um erro desconhecido.`
      };
    }
    dataFragment = (
      <EuiFlexItem grow={false}>
        <EuiEmptyPrompt
          iconType="dataVisualizer"
          title={
            <EuiTitle size="s">
              <h4>{error.title}</h4>
            </EuiTitle>
          }
          titleSize="xs"
          body={
            <Fragment>
              <p>{error.message}</p>
            </Fragment>
          }
        />
      </EuiFlexItem>
    );
  }

  let mainFragment = (<></>);

  if (isLoading) {
    mainFragment = (
      <EuiFlexItem grow={false}>
        <EuiLoadingSpinner 
          size="xl"
        />
      </EuiFlexItem>
    );
  } else {
    if (validURI) {
      mainFragment = (
        <EuiFlexItem grow={false} className={"merda"}>
          <EuiFlexGroup justifyContent="center" alignItems="center" style={supliedStyle}>
            {prefixFragment}
            {dataFragment}
            {sufixFragment}
          </EuiFlexGroup>
          {labelsFragment}
        </EuiFlexItem>
      );
    } else {
      mainFragment = (
        <EuiFlexItem grow={false}>
          <EuiText color="subdued">A URL informada não é uma URL válida!</EuiText>
        </EuiFlexItem>
      );
    }
  }

  return (
    <Fragment>
      <EuiFlexGroup
        justifyContent="spaceEvenly"
        alignItems="center"
        style={
          !isLoading && validURI && data_error === `noErros` 
            ? supliedStyleCard
            : {}
        }
      >
        {mainFragment}
      </EuiFlexGroup>
    </Fragment>
  );
}