/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {WebView} from 'react-native-webview';

export const WebViewComponent = ({
  url,
  navigation,
  containerStyle,
  onLoadStart = () => {},
  onLoadEnd = () => {},
  loaderComponent = () => {},
}) => {
  return (
    <WebView
      source={{uri: url}}
      goBack={() => navigation?.goBack()}
      originWhitelist={['http://*', 'https://*', 'intent://*', 'finezzy://*']}
      style={{
        flex: 0,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        ...containerStyle,
      }}
      containerStyle={{marginBottom: 24}}
      startInLoadingState={true}
      onLoadStart={syntheticEvent => {
        // update component to be aware of loading status
        const {nativeEvent} = syntheticEvent;
        // setLoading(nativeEvent.loading);
        onLoadStart(nativeEvent);
      }}
      onLoadProgress={({nativeEvent}) => {
        // setLoading(nativeEvent.progress);
      }}
      onLoadEnd={syntheticEvent => {
        // update component to be aware of loading status
        const {nativeEvent} = syntheticEvent;
        // setLoading(nativeEvent.loading);
        onLoadEnd(nativeEvent);
      }}
      renderLoading={() => {
        return loaderComponent();
      }}
    />
  );
};
