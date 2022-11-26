/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
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
import AuthWrapper from '../../../hocs/AuthWrapper';
import {CompletedLoanApplication, TickCircle, WarningIcon1} from 'assets';
import useExitApp from '../../../reusables/useExitApp';
import useOnboardingHandleRedirection from '../../../reusables/useOnboardingHandleRedirection';
import useUser from '../../../reusables/useUser';

export default function ({navigation}) {
  const theme = useTheme();
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [showGreenCircleIcon, setShowGreenCircleIcon] = useState(false);
  const [apiCallStatus, setApiCallStatus] = useState(null);

  const showGreenTickCircleIcon = useRef(() => {});

  useExitApp();
  const user = useUser();

  const {handleUpdateOnboardingStep} = useOnboardingHandleRedirection();

  showGreenTickCircleIcon.current = () =>
    /^[0-9]{2}(-)[0-9]{2}(-)[0-9]{4}$/.test(dob)
      ? setShowGreenCircleIcon(true)
      : setShowGreenCircleIcon(false);

  useEffect(() => {
    showGreenTickCircleIcon.current();
  }, [dob]);

  const handleChangeText = text => {
    setError(null);
    setDob(text);
  };

  const handleUpdateUserProfile = async () => {
    try {
      setApiCallStatus('loading');
      if (dob?.length === 0) {
        setError('Please enter the date of birth');
        setApiCallStatus('failed');
      } else if (/^[0-9]{2}(-)[0-9]{2}(-)[0-9]{4}$/.test(dob)) {
        const updateProfileResponse = await handleUpdateOnboardingStep(user, {
          risk_profiling: {
            status: 'completed',
            data: {
              dob: dob,
            },
          },
        });
        console.log(
          'updateProfileResponse of enter dob screen',
          updateProfileResponse,
        );
        if (updateProfileResponse) {
          setApiCallStatus('success');
          navigation.replace('Protected');
        }
      } else {
        setApiCallStatus('failed');
        setError('Please enter the valid date of birth');
      }
    } catch (err) {
      setApiCallStatus('failed');
      console.log('error', err);
    }
  };
  return (
    <AuthWrapper onBackPress={() => {}}>
      <AuthHeading>
        A pat on your back for getting the 1st step right
      </AuthHeading>

      <View style={{paddingTop: 24, alignItems: 'center'}}>
        <CompletedLoanApplication />
      </View>

      <GrayBodyText
        style={{
          fontFamily: theme.fonts.regular,
          paddingTop: 24,
          paddingRight: 24,
        }}>
        We are going to ask you a few questions. The outcome will play a key
        role in your financial future.
      </GrayBodyText>

      <GroupText style={{paddingTop: 24}}>
        <GrayBodyText
          style={{
            fontFamily: theme.fonts.regular,
            paddingTop: 24,
          }}>
          Tell us first about that big day you were born and get{' '}
        </GrayBodyText>
        <BaseBodyText
          style={{
            fontFamily: theme.fonts.bold,
            color: theme.colors.primaryOrange,
          }}>
          guaranteed gifts.
        </BaseBodyText>
      </GroupText>

      <View style={{paddingTop: 17}}>
        <BaseTextInput
          placeholder="DD-MM-YYYY"
          onChangeText={text => handleChangeText(text)}
          value={dob}
          calendar={true}
          error={error}
          maximumDate={new Date()}
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

      <View style={{paddingTop: 32}}>
        <BaseButton
          loading={apiCallStatus === 'loading'}
          onPress={() => {
            handleUpdateUserProfile();
          }}>
          Let’s get to know you
        </BaseButton>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 16,
        }}>
        <TextButton
          onPress={() =>
            apiCallStatus !== 'loading' && navigation.replace('Protected')
          }
          style={{
            paddingHorizontal: 30,
          }}>
          Skip
        </TextButton>
      </View>
    </AuthWrapper>
  );
}
