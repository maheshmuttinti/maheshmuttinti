/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {Pressable, View} from 'react-native';
import {
  AuthHeading,
  BaseButton,
  TextButton,
  GrayBodyText,
  BaseBodyText,
  BaseTextInput,
  GroupText,
} from 'uin';
import {useTheme} from 'theme';
import ScreenWrapper from '../../../../../hocs/screenWrapperWithoutBackButton';
import {ForwardEmail, TickCircle, WarningIcon1} from 'assets';
import useExitApp from '../../../../../reusables/useExitApp';
import {validatePAN} from 'utils';
import {usePANCollectRedirection} from '../../../../../reusables/usePANCollectRedirection';

export default function ({navigation}) {
  const theme = useTheme();
  const [pan, setPAN] = useState('');
  const [error, setError] = useState('');
  const [showGreenCircleIcon, setShowGreenCircleIcon] = useState(false);
  const [apiCallStatus, setApiCallStatus] = useState(null);

  const showGreenTickCircleIcon = useRef(() => {});

  const handleRedirection = usePANCollectRedirection(pan, navigation);

  useExitApp();

  showGreenTickCircleIcon.current = panNumber =>
    validatePAN(panNumber)
      ? setShowGreenCircleIcon(true)
      : setShowGreenCircleIcon(false);

  const handleChangeText = text => {
    setError(null);
    showGreenTickCircleIcon.current(text);
    setPAN(text.toUpperCase());
  };

  const handleSubmit = async () => {
    try {
      setApiCallStatus('loading');
      if (pan?.length === 0) {
        setError('Please enter the PAN Card Number');
        setApiCallStatus('failed');
      }
      if (pan?.length > 0 && validatePAN(pan) === false) {
        setError('Please enter the valid PAN Card Number');
        setApiCallStatus('failed');
        return;
      } else {
        await handleRedirection();
        setApiCallStatus('success');
      }
    } catch (err) {
      setApiCallStatus('failed');
      console.log('error', err);
    }
  };

  return (
    <ScreenWrapper onBackPress={() => {}}>
      <View style={{paddingHorizontal: 24, flex: 1}}>
        <View style={{marginTop: 41}}>
          <AuthHeading>Your pre approved loan is waiting for you</AuthHeading>

          <View style={{paddingTop: 24, alignItems: 'center'}}>
            <ForwardEmail />
          </View>

          <GroupText style={{paddingTop: 24}}>
            <GrayBodyText
              style={{
                fontFamily: theme.fonts.regular,
                paddingTop: 24,
              }}>
              Just tell us your{' '}
            </GrayBodyText>
            <BaseBodyText
              style={{
                fontFamily: theme.fonts.bold,
                color: theme.colors.primaryOrange,
              }}>
              PAN Card{' '}
            </BaseBodyText>
            <GrayBodyText
              style={{
                fontFamily: theme.fonts.regular,
                paddingTop: 24,
              }}>
              Number
            </GrayBodyText>
          </GroupText>

          <View style={{paddingTop: 17}}>
            <BaseTextInput
              placeholder="Enter PAN Card Number"
              onChangeText={text => handleChangeText(text)}
              value={pan}
              error={error}
              overlappingIcon={() =>
                (error && (
                  <View style={{position: 'absolute', right: 13.24}}>
                    <WarningIcon1 />
                  </View>
                )) ||
                (showGreenCircleIcon && (
                  <View style={{position: 'absolute', right: 13.24}}>
                    <TickCircle />
                  </View>
                ))
              }
            />
          </View>

          <GrayBodyText
            style={{
              fontFamily: theme.fonts.regular,
              paddingTop: 24,
              paddingRight: 24,
            }}>
            You will receive an OTP to the linked email and mobile number
            registered with MF RTA
          </GrayBodyText>

          <View style={{paddingTop: 32}}>
            <BaseButton
              loading={apiCallStatus === 'loading'}
              onPress={() => {
                handleSubmit();
              }}>
              Know your pre approved loan
            </BaseButton>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 16,
              paddingBottom: 24,
            }}>
            <TextButton
              onPress={() =>
                apiCallStatus !== 'loading' && navigation.replace('Protected')
              }
              style={{
                paddingHorizontal: 30,
              }}>
              I don't want to know
            </TextButton>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}
