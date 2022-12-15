import React, {useEffect} from 'react';
import ScreenWrapper from '../../hocs/screenWrapper';
import {useSelector, shallowEqual} from 'react-redux';
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
    navigation.canGoBack() && navigation.goBack();
  };

  return (
    <ScreenWrapper>
      <Content
        heading={'Oops, Something is not right!'}
        text={
          'Please check the URL link or let us take you  back to the home screen'
        }
        buttonText={'Go back'}
        handleButtonClick={() => handleClick()}
      />
    </ScreenWrapper>
  );
}
