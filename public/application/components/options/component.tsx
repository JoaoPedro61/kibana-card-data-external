import React, { Fragment, useState, useEffect } from 'react';

import {
  EuiPanel,
  EuiForm,
  EuiFormRow,
  EuiRange,
  EuiFieldText,
  EuiSwitch,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiTitle,
  EuiCodeBlock,
  EuiButtonEmpty,
  EuiLoadingSpinner,
  EuiEmptyPrompt,
  EuiToolTip
} from '@elastic/eui';
import { take } from 'rxjs/operators';

import { get as letItGo, requestErrors, ALLOWED_INPUT } from './../../../../common';



export function Component({ setValue, stateParams, setValidity }) {

  function _validURITarget(target: string): boolean {
    if (`string` !== typeof target) {
      return false;
    } else {
      const value = target.trim();
      if (!value.length) {
        return false;
      } else {
        if (!/^http\:\/\/|^https\:\/\//gm.test(value)) {
          return false;
        } else {
          if (value === `http://` || value === `https://`) {
            return false;
          }
        }
      }
    }
    return true;
  }

  const [ currentStateParams, setNextStateParams ] = useState(stateParams);

  const [ isVisiblePreview, setIsVisiblePreview ] = useState(false);

  const [ targetInvalid, setTargetIsInvalid ] = useState(!_validURITarget(stateParams.uriTarget));

  const [ responsePreview, setResponsePreview ] = useState<any>({});

  const [ responsePreviewError, setResponsePreviewError ] = useState<string>('noErros');

  const [ previewLoading, setPreviewLoading ] = useState(false);

  if (!currentStateParams.hasOwnProperty(`counter`)) {
    currentStateParams.counter = 1;

    setValue(`counter`, currentStateParams.counter);
  } else {
    if (currentStateParams.counter > 1000) {
      currentStateParams.counter = 0;

      setValue(`counter`, currentStateParams.counter);
    }
  }

  useEffect(() => {
    let didCancel = false;
    if (!didCancel) {
      const targetIsValid = _validURITarget(currentStateParams.uriTarget);
      setValidity(targetIsValid);
    }
    return () => {
      didCancel = true;
    };
  }, []);

  function _setUriTarget(value: string): void {
    if (value !== currentStateParams.uriTarget) {
      const isValid = _validURITarget(value);
      setTargetIsInvalid(!isValid);
      setValidity(isValid);

      setValue(`uriTarget`, value);
      setNextStateParams({
        ...currentStateParams,
        uriTarget: value
      });
    }
  }

  function _setLabel(value: string): void {
    if (value !== currentStateParams.label) {
      setValue(`label`, value);
      setNextStateParams({
        ...currentStateParams,
        label: value
      });
    }
  }

  function _setSubText(value: string): void {
    if (value !== currentStateParams.subText) {
      setValue(`subText`, value);
      setNextStateParams({
        ...currentStateParams,
        subText: value
      });
    }
  }

  function _setShowLabels(value: boolean): void {
    setValue(`labels`, value);
    setNextStateParams({
      ...currentStateParams,
      labels: value
    });
  }

  function _setPrefix(value: string): void {
    if (value !== currentStateParams.prefix) {
      setValue(`prefix`, value);
      setNextStateParams({
        ...currentStateParams,
        prefix: value
      });
    }
  }

  function _setSufix(value: string): void {
    if (value !== currentStateParams.sufix) {
      setValue(`sufix`, value);
      setNextStateParams({
        ...currentStateParams,
        sufix: value
      });
    }
  }

  function _setFontSize(value: string): void { 
    try {
      const parsed = parseInt(value, 10);
      setValue(`style`, {
        ...stateParams.style,
        fontSize: parsed
      });
      setValue(`counter`, stateParams.counter++);
    } catch (e) {
      throw new Error(e);
    }
  }

  function _setAllowInheritPropsByRequestResponse(value: boolean): void {
    setValue(`allowInheritPropsByRequestResponse`, value);
    setNextStateParams({
      ...currentStateParams,
      allowInheritPropsByRequestResponse: value
    });
  }

  function _setAllowReplacePropsByRequestResponse(value: boolean): void {
    setValue(`allowReplacePropsByRequestResponse`, value);
    setNextStateParams({
      ...currentStateParams,
      allowReplacePropsByRequestResponse: value
    });
  }

  function _seeResponse(): void {
    if (!isVisiblePreview) {
      setIsVisiblePreview(true);
    }
  }

  function _loadResponse(): void {
    if (!targetInvalid) {
      setResponsePreviewError('noErros');
      setResponsePreview({});
      setPreviewLoading(true);
      letItGo(currentStateParams.uriTarget)
        .pipe(take(1))
        .subscribe((response) => {
          setResponsePreviewError('noErros');
          setResponsePreview(response);
          setPreviewLoading(false);
        }, (error) => {
          setResponsePreviewError(error.statusName);
          setResponsePreview({});
          setPreviewLoading(false);
        });
    } else {
      if (previewLoading) {
        setPreviewLoading(false);
      }
    }
  }

  let flyResponseFragment = () => (<></>);

  if (isVisiblePreview) {
    flyResponseFragment = () => {
      let preview;
      if (previewLoading) {
        preview = (
          <EuiFlexGroup alignItems="center" justifyContent="center" direction="row">
            <EuiFlexItem grow={false}>
              <EuiSpacer size="xxl"/>
              <EuiLoadingSpinner size="xl" />
            </EuiFlexItem>
          </EuiFlexGroup>
        );
      } else {
        if (responsePreviewError === 'noErros') {
          preview = (
            <EuiCodeBlock language="json">{JSON.stringify(responsePreview, null, 2)}</EuiCodeBlock>
          );
        } else {
          let error;
          if (requestErrors.hasOwnProperty(responsePreviewError)) {
            error = (requestErrors as any)[responsePreviewError];
          } else {
            error = {
              title: `Opss...`,
              message: `Sorry, an unknown error occurred.`
            };
          }
          preview = (
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
          );
        }
      }

      return (
        <Fragment>
          <EuiFlyout onClose={() => setIsVisiblePreview(false)} aria-labelledby="responseTitle">
            <EuiFlyoutHeader>
              <EuiTitle size="s">
                <h3 id="responseTitle">
                  Preview response
                </h3>
              </EuiTitle>
            </EuiFlyoutHeader>
            <EuiFlyoutBody>
              <EuiSpacer size="m"/>
              <EuiTitle size="xs">
                <h3>
                  Data structure recomended:
                </h3>
              </EuiTitle>
              <EuiSpacer size="m"/>
              <EuiCodeBlock language="json">{JSON.stringify(ALLOWED_INPUT, null, 2)}</EuiCodeBlock>
              <EuiSpacer size="s"/>
              <EuiText color="subdued">
                PS: Optional properties will only be used if one or both of the following attributes are active: "Inherit properties from request response" and "Replace properties from request response".
              </EuiText>
              <EuiSpacer size="m"/>
              <EuiTitle size="xs">
                <h3>
                  Data structure in use:
                </h3>
              </EuiTitle>
              <EuiToolTip position="top" content={targetInvalid ? `Invalid URI target` : `Valid URI target` }>
                <EuiText color={targetInvalid ? `danger` : `default`}>
                  <p>A simple preview from: <i>{currentStateParams.uriTarget ? `"${currentStateParams.uriTarget}"` : "URI is not defined"}</i></p>
                </EuiText>
              </EuiToolTip>
              <EuiSpacer size="m"/>
              {preview}
            </EuiFlyoutBody>
          </EuiFlyout>
        </Fragment>
      );
    }
  }

  let _labelsFragment = (<></>);

  if (stateParams.labels) {
    _labelsFragment = (
      <Fragment>
        <EuiSpacer size="s" />
        <EuiFormRow
          label="Target label"
          fullWidth
          helpText={`This is will shown in under metric value.`}
        >
          <EuiFieldText
            fullWidth
            compressed
            defaultValue={stateParams.label}
            placeholder="Label"
            onBlur={e => _setLabel(e.target.value)}
          />
        </EuiFormRow>
        <EuiSpacer size="s" />
        <EuiFormRow
          label="Target sub-text"
          fullWidth
          helpText={`This is will shown in under label value.`}
        >
          <EuiFieldText
            fullWidth
            compressed
            defaultValue={stateParams.subText}
            placeholder="SubText"
            onBlur={e => _setSubText(e.target.value)}
          />
        </EuiFormRow>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <EuiPanel>
        <EuiForm>
          <EuiFormRow
            label="URI Target"
            fullWidth
            helpText={`This field must start with "http://" or "https://".`}
          >
            <EuiFieldText
              fullWidth
              compressed
              required
              isInvalid={targetInvalid}
              defaultValue={stateParams.uriTarget}
              placeholder="https://your.domain"
              onBlur={e => _setUriTarget(e.target.value)}
            />
          </EuiFormRow>
          <EuiSpacer size="s" />
          <EuiFlexGroup gutterSize="s" alignItems="center" justifyContent="flexEnd">
            <EuiFlexItem  grow={false}>
              <EuiButtonEmpty onClick={() => { _loadResponse(); _seeResponse() }} size="s">
                See response
              </EuiButtonEmpty>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer size="m" />
          <EuiFlexGroup justifyContent="spaceBetween" alignItems="center">
            <EuiFlexItem>
              <EuiFormRow
                label="Prefix"
                fullWidth
              >
                <EuiFieldText
                  fullWidth
                  compressed
                  defaultValue={stateParams.prefix}
                  placeholder="Any string"
                  onBlur={e => _setPrefix(e.target.value)}
                />
              </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFormRow
                label="Sufix"
                fullWidth
              >
                <EuiFieldText
                  fullWidth
                  compressed
                  defaultValue={stateParams.sufix}
                  placeholder="Any string"
                  onBlur={e => _setSufix(e.target.value)}
                />
              </EuiFormRow>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer size="m" />
          <EuiFormRow fullWidth>
            <EuiSwitch
              label="Show labels"
              compressed
              value={stateParams.labels}
              checked={stateParams.labels}
              onChange={e => _setShowLabels(e.target.checked)}
            />
          </EuiFormRow>
          {_labelsFragment}
          <EuiSpacer size="m" />
          <EuiFormRow
            fullWidth
            helpText={
              (
                <Fragment>
                  <EuiText size="xs">This allows the visualization to extend the properties that will be received from the request, such as: label, subText, prefix, suffix, labels (this is a boolean), fontSize.</EuiText>
                  <EuiText size="xs">PS: This will only inherit some data, if any data is defined here it will ignore this, and will use the value passed here.</EuiText>
                </Fragment>
              )
            }
          >
            <EuiSwitch
              label="Inherit properties from request response"
              compressed
              value={stateParams.allowInheritPropsByRequestResponse}
              checked={stateParams.allowInheritPropsByRequestResponse}
              onChange={e => _setAllowInheritPropsByRequestResponse(e.target.checked)}
            />
          </EuiFormRow>
          <EuiSpacer size="m" />
          <EuiFormRow
            fullWidth
            helpText={
              (
                <Fragment>
                  <EuiText size="xs">This allows the visualization to replicate the properties that will be received from the request, such as: label, subText, prefix, suffix, labels(this is a boolean), fontSize.</EuiText>
                </Fragment>
              )
            }
          >
            <EuiSwitch
              label="Replace properties from request response"
              compressed
              value={stateParams.allowReplacePropsByRequestResponse}
              checked={stateParams.allowReplacePropsByRequestResponse}
              onChange={e => _setAllowReplacePropsByRequestResponse(e.target.checked)}
            />
          </EuiFormRow>
          <EuiSpacer size="m" />
          <EuiFormRow
            label={`Font Size ${stateParams.style.fontSize}pt`}
            fullWidth
          >
            <EuiRange
              fullWidth
              min={12}
              max={120}
              step={1}
              compressed
              value={stateParams.style.fontSize}
              onChange={e => {_setFontSize((e as any).target.value)}}
              showLabels
            />
          </EuiFormRow>
        </EuiForm>
      </EuiPanel>
      {flyResponseFragment()}
    </Fragment>
  );
}