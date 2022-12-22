/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {
  AuthHeading,
  BaseButton,
  TextButton,
  GrayBodyText,
  BaseBodyText,
  BaseTextInput,
  GroupText,
  Heading,
} from 'uin';
import {useTheme} from 'theme';
import ScreenWrapper from '../../hocs/screenWrapperWithoutBackButton';
import {ForwardEmail, TickCircle} from 'assets';
import useExitApp from '../../reusables/useExitApp';
import {usePANCollectRedirection} from '../../reusables/usePANCollectRedirection';
import {prettifyJSON, validatePAN as basicValidatePAN} from 'utils';
import {validatePAN as signzyValidatePAN} from 'services';
import * as Sentry from '@sentry/react-native';
import {InputErrorMessage} from '../../reusables/ErrorMessage';
import useBetaForm from '@reusejs/react-form-hook';

export default function ({navigation}) {
  const theme = useTheme();
  const [pan, setPAN] = useState('');
  const [basicValidationError, setBasicValidationError] = useState('');
  const [showGreenCircleIcon, setShowGreenCircleIcon] = useState(false);
  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState(null);
  const [validUser, setValidUser] = useState(null);
  const [isFetchingPANDetails, setIsFetchingPANDetails] = useState(false);
  const form = useBetaForm({
    error: '',
  });

  const showGreenTickCircleIcon = useRef(() => {});

  const handleRedirection = usePANCollectRedirection(
    pan,
    validUser,
    form,
    navigation,
  );

  useExitApp();

  showGreenTickCircleIcon.current = panNumber =>
    basicValidatePAN(panNumber)
      ? setShowGreenCircleIcon(true)
      : setShowGreenCircleIcon(false);

  const handleChangeText = text => {
    setValidUser(null);
    setBasicValidationError(null);
    setMessage(null);
    form.setErrors({});
    if (text.length <= 10) {
      showGreenTickCircleIcon.current(text);
      setPAN(text);
    }
    if (text.length === 10) {
      if (basicValidatePAN(text) === false) {
        setBasicValidationError('Please enter a valid PAN number');
      }
    }
  };

  const validatePAN = useCallback(async () => {
    try {
      setValidUser(null);
      setBasicValidationError(null);
      setMessage(null);
      setIsFetchingPANDetails(true);
      const payload = {pan: pan?.toUpperCase()};
      console.log('payload for validatePAN: ', prettifyJSON(payload));
      const panValidationResponse = await signzyValidatePAN(payload);
      console.log('panValidationResponse: ', panValidationResponse);
      if (panValidationResponse?.pan && panValidationResponse?.name) {
        setValidUser(panValidationResponse?.name);
        // setValidUser('MUTTINTI MAHESH');
        setIsFetchingPANDetails(false);
      }
    } catch (err) {
      setValidUser(null);
      form.setErrors({error: err?.message?.errors?.error});
      if (err?.pan) {
        setMessage(err?.pan);
        setIsFetchingPANDetails(false);
        setValidUser(null);
      } else {
        if (err?.error) {
          setMessage(err?.error);
          setIsFetchingPANDetails(false);
          setValidUser(null);
        } else {
          setIsFetchingPANDetails(false);
          setValidUser(null);
        }
      }
      Sentry.captureException(err);
      return err;
    }
  }, [pan]);

  useEffect(() => {
    if (showGreenCircleIcon) {
      validatePAN();
    }
  }, [showGreenCircleIcon, validatePAN]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await handleRedirection();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log('error', err);
    }
  };

  const handleSkip = () => {
    navigation.replace('Protected');
    // navigation.replace('FetchCAS', {screen: 'FetchCASFromRTAs'});
  };

  return (
    <ScreenWrapper>
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
              editable={!isFetchingPANDetails}
              overlappingIcon={() =>
                isFetchingPANDetails && (
                  <View style={{position: 'absolute', right: 13.24}}>
                    <ActivityIndicator color={theme.colors.primaryBlue} />
                  </View>
                )
              }
              autoCapitalize={'characters'}
            />
          </View>

          {validUser ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 12,
                }}>
                <TickCircle />
                <Heading
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.fonts.bold,
                    paddingLeft: 4,
                    ...theme.fontSizes.medium,
                  }}>{`PAN Card Holder: ${validUser}`}</Heading>
              </View>
            </>
          ) : null}

          {form.errors.get('error') ? (
            <>
              <InputErrorMessage errorMessage={`${form.errors.get('error')}`} />
            </>
          ) : null}

          {message ? (
            <>
              {Array.isArray(message) && message?.length > 1 ? (
                message.map((errMsg, index) => (
                  <InputErrorMessage
                    key={`error-msg-${index}`}
                    errorMessage={errMsg}
                  />
                ))
              ) : Array.isArray(message) && message?.length === 0 ? (
                <>
                  <InputErrorMessage errorMessage={`${message?.[0]}`} />
                </>
              ) : (
                <>
                  <InputErrorMessage errorMessage={`${message}`} />
                </>
              )}
            </>
          ) : null}

          {basicValidationError ? (
            <>
              <InputErrorMessage errorMessage={`${basicValidationError}`} />
            </>
          ) : null}

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
              loading={loading === true}
              disable={!showGreenCircleIcon || !validUser}
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
              onPress={() => !loading && handleSkip()}
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
