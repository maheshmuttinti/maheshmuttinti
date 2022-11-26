import React, {useEffect} from 'react';
import ScreenWrapper from '../../hocs/screen_wrapper';
import {useSelector, shallowEqual} from 'react-redux';
import {showToast} from 'utils';
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

  const handleClick = () => {
    showToast('Coming Soon!');
  };

  return (
    <ScreenWrapper>
      <Content
        heading={'You haven’t added any funds yet'}
        text={'Don’t miss out on trending funds and start investing today!'}
        buttonText={'Start Investing'}
        handleButtonClick={() => handleClick()}
      />
    </ScreenWrapper>
  );
}
