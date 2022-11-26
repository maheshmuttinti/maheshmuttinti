import React, {useEffect} from 'react';
import ScreenWrapper from '../../hocs/screen_wrapper';
import {useSelector, shallowEqual} from 'react-redux';
import {showAndroidToast} from 'utils';
import {Platform, Alert} from 'react-native';
import Content from './Content';

export default function SignInScreen({navigation}) {
  const {networkStatus} = useSelector(
    ({network}) => ({
      networkStatus: network.networkStatus,
    }),
    shallowEqual,
  );

  useEffect(() => {
    networkStatus === 'online' && navigation.canGoBack() && navigation.pop();
  });

  const handleRetry = () => {
    networkStatus === 'online'
      ? navigation.canGoBack() && navigation.pop()
      : Platform.OS === 'ios'
      ? Alert.alert('Please check your internet connection and try again.')
      : showAndroidToast(
          'Please check your internet connection and try again.',
        );
  };

  return (
    <ScreenWrapper>
      <Content
        heading={'No Connection'}
        text={'Please check your internet connection and try again'}
        buttonText={'Retry'}
        handleButtonClick={() => handleRetry()}
      />
    </ScreenWrapper>
  );
}
