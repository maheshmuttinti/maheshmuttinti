/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {View} from 'react-native';
import {
  AuthHeading,
  TextButton,
  BlackBodyText,
  GrayBodyText,
  BaseBodyText,
  BaseTextInput,
  GroupText,
} from 'uin';
import {useTheme} from 'theme';
import AuthWrapper from '../../../hocs/AuthWrapper';
import {ForwardEmail, TickCircle, WarningIcon1} from 'assets';
import {EMAIL_REGEX} from 'utils';
import {KnowYourInvestmentActionButton} from './PermissionsEmailSentScreen';
import Config from 'react-native-config';
import useExitApp from '../../../reusables/useExitApp';

export default function ({navigation}) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [disableButton, setDisableButton] = useState(null);
  const [showGreenCircleIcon, setShowGreenCircleIcon] = useState(false);
  const showGreenTickCircleIcon = useRef(() => {});

  showGreenTickCircleIcon.current = () => {
    EMAIL_REGEX.test(email)
      ? setShowGreenCircleIcon(true)
      : setShowGreenCircleIcon(false);
  };

  useExitApp();

  useEffect(() => {
    showGreenTickCircleIcon.current();
  }, [email]);

  const handleChangeText = text => {
    setError(null);
    setEmail(text);
  };

  return (
    <AuthWrapper>
      <AuthHeading>Email ID</AuthHeading>

      <View style={{paddingTop: 16}}>
        <GrayBodyText>
          Kindly provide the E-Mail IDs linked to your Mutual Fund Investments
        </GrayBodyText>
      </View>

      <View style={{paddingTop: 24}}>
        <BaseTextInput
          placeholder="Email ID"
          onChangeText={text => handleChangeText(text)}
          value={email}
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

      <View style={{paddingTop: 40, alignItems: 'center'}}>
        <ForwardEmail />
      </View>

      <GroupText style={{paddingTop: 24}}>
        <GrayBodyText
          style={{
            fontFamily: theme.fonts.regular,
          }}>
          You will receive the MF statements on your E-Mail from{' '}
        </GrayBodyText>

        <BlackBodyText style={{fontWeight: theme.fontWeights.veryBold}}>
          donotreply@camsonline.com.{' '}
        </BlackBodyText>

        <GrayBodyText
          style={{
            fontFamily: theme.fonts.regular,
          }}>
          Please forward the statements to{' '}
        </GrayBodyText>

        <BlackBodyText style={{fontWeight: theme.fontWeights.veryBold}}>
          {Config.RADICAL_SUPPORT_URL}.{' '}
        </BlackBodyText>

        <GrayBodyText
          style={{
            fontFamily: theme.fonts.regular,
          }}>
          And your personalized dashboard will be ready in a few minutes{' '}
        </GrayBodyText>
      </GroupText>

      <View style={{paddingTop: 24, paddingRight: 12}}>
        <BaseBodyText
          style={{
            fontFamily: theme.fonts.bold,
            color: theme.colors.primaryOrange,
          }}>
          Meanwhile, we have an exciting exercise for you...
        </BaseBodyText>
      </View>

      <KnowYourInvestmentActionButton
        navigation={navigation}
        email={email}
        onActionIsCalling={check => setDisableButton(check)}
        onEmptyEmailLength={() => setError('Please enter the email ID')}
        onEmailRegexPassed={() => setError('')}
        onEmailRegexFailed={() => setError('Please enter the valid email ID')}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 16,
        }}>
        <TextButton
          onPress={() =>
            disableButton ? {} : navigation.replace('Protected')
          }>
          I don't want to know
        </TextButton>
      </View>
    </AuthWrapper>
  );
}
