/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {View} from 'react-native';
import {
  AuthHeading,
  BaseButton,
  TextButton,
  GrayBodyText,
  BaseBodyText,
  BaseTextInputCapitalizationSupport,
  GroupText,
  Heading,
} from 'uin';
import {useTheme} from 'theme';
import ScreenWrapper from '../../hocs/screenWrapperWithoutBackButton';
import {ForwardEmail, TickCircle} from 'assets';
import useExitApp from '../../reusables/useExitApp';
import {usePANCollectRedirection} from '../../reusables/usePANCollectRedirection';
import {validatePAN as basicValidatePAN} from 'utils';
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
  const [validUser, setValidUser] = useState(false);
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
      form.setField(text.toUpperCase());
      setPAN(text.toUpperCase());
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
      const payload = {pan};
      const panValidationResponse = await signzyValidatePAN(payload);
      console.log('panValidationResponse: ', panValidationResponse);
      if (panValidationResponse?.pan && panValidationResponse?.name) {
        setValidUser(panValidationResponse?.name);
        setIsFetchingPANDetails(false);
      }
    } catch (err) {
      setValidUser(false);
      console.log('err: ', err);
      if (err?.pan) {
        setMessage(err?.pan);
        setIsFetchingPANDetails(false);
        setValidUser(false);
      } else {
        if (err?.error) {
          setMessage(err?.error);
          setIsFetchingPANDetails(false);
          setValidUser(false);
        } else {
          setIsFetchingPANDetails(false);
          setValidUser(false);
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

  console.log('getError', form.errors.get('error'));

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
            <BaseTextInputCapitalizationSupport
              placeholder="Enter PAN Card Number"
              onChangeText={text => handleChangeText(text)}
              value={pan}
              overlappingIcon={() =>
                (showGreenCircleIcon && !validUser) ||
                (message && (
                  <View style={{position: 'absolute', right: 13.24}}>
                    <TickCircle />
                  </View>
                ))
              }
            />
          </View>

          {isFetchingPANDetails ? (
            <>
              <Heading
                style={{
                  color: theme.colors.text,
                  fontFamily: theme.fonts.medium,
                  paddingLeft: 4,
                  paddingTop: 12,
                  ...theme.fontSizes.medium,
                }}>
                Loading PAN Card Details...
              </Heading>
            </>
          ) : validUser ? (
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
              onPress={() => !loading && navigation.replace('Protected')}
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
