import React from 'react';
import {WebView} from 'react-native-webview';

export default function ({url}) {
    console.log(url,"url")
  return (
    <WebView
      source={{uri:url}}
      originWhitelist={['http://*', 'https://*', 'intent://*', 'finezzy://*']}
    />
  );
}
