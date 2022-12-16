import React, {useState} from 'react';
import {WebView} from 'react-native-webview';
import {showNativeAlert} from 'utils';
import {Platform} from 'react-native';

export default function ({route, navigation}) {
  const uri = route?.params?.uri;
  const applicationId = route?.params?.applicationId;
  const [show, setShow] = useState(true);
  const stateChange = address => {
    if (address.url.includes('error')) {
      navigation.navigate('Protected', {
        screen: 'LoanApplication',
        params: {step: 2, applicationId: applicationId},
      });
      setShow(false);
      showNativeAlert('Document fetching failed');
    } else if (
      address.url.includes('code') &&
      address.url.includes('state') &&
      address.url.includes('hmac') &&
      address.loading === false
    ) {
      navigation.navigate('Protected', {
        screen: 'LoanApplication',
        params: {step: 2, applicationId: applicationId},
      });
      setShow(false);
      showNativeAlert('Document fetching success');
    }
  };
  return (
    show && (
      <WebView
        source={{uri}}
        goBack={() => navigation.goBack()}
        originWhitelist={['http://*', 'https://*', 'intent://*', 'finezzy://*']}
        onNavigationStateChange={stateChange}
        startInLoadingState={Platform.OS === 'ios' ? true : false}
        onShouldStartLoadWithRequest={false}
      />
    )
  );
}
