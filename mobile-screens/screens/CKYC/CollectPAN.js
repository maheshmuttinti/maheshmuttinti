/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
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
import {BackArrow, ForwardEmail, TickCircle} from 'assets';
import useExitApp from '../../reusables/useExitApp';
import {usePANCollectRedirection} from '../../reusables/usePANCollectRedirection';
import {validatePAN as basicValidatePAN} from 'utils';
import {validatePAN as signzyValidatePAN} from 'services';
import {InputErrorMessage} from '../../reusables/ErrorMessage';
import useBetaForm from '@reusejs/react-form-hook';

export default function ({navigation, route}) {
  const waitForResponse = route?.params?.waitForResponse || false;
  const theme = useTheme();
  const [basicValidationError, setBasicValidationError] = useState('');
  const [showGreenCircleIcon, setShowGreenCircleIcon] = useState(false);
  const [loading, setLoading] = useState(null);
  const [validUser, setValidUser] = useState(null);
  const [isFetchingPANDetails, setIsFetchingPANDetails] = useState(false);
  const [keyboardType, setKeyboardType] = useState('default');
  const form = useBetaForm({
    pan: '',
    error: '',
  });

  const showGreenTickCircleIcon = useRef(() => {});

  const handleRedirection = usePANCollectRedirection(
    form,
    validUser,
    navigation,
    waitForResponse,
  );

  useExitApp();

  showGreenTickCircleIcon.current = panNumber =>
    basicValidatePAN(panNumber)
      ? setShowGreenCircleIcon(true)
      : setShowGreenCircleIcon(false);

  const handleChangeText = text => {
    setValidUser(null);
    setBasicValidationError(null);
    form.setErrors({});
    if (text.length <= 10) {
      if (text.length >= 4) {
        if (text.charAt(3) !== 'P') {
          form.setErrors({
            pan: 'Our services are offered only for Individual PAN holders. Please ensure you provide the correct PAN',
          });
          if (text.length < 5) {
            setKeyboardType('default');
          } else if (text.length === 5 || text.length <= 8) {
            setKeyboardType('numeric');
          } else if (text.length === 9 && text.length <= 10) {
            setKeyboardType('default');
          }
        } else if (text.length < 5) {
          setKeyboardType('default');
        } else if (text.length === 5 || text.length <= 8) {
          setKeyboardType('numeric');
        } else if (text.length === 9 && text.length <= 10) {
          setKeyboardType('default');
        }
      }
      showGreenTickCircleIcon.current(text);
      form.setField('pan', text);
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
      form.setErrors({});
      setIsFetchingPANDetails(true);
      const payload = {pan: form?.value?.pan?.toUpperCase()};
      const panValidationResponse = await signzyValidatePAN(payload);
      if (panValidationResponse?.pan && panValidationResponse?.name) {
        setValidUser(panValidationResponse?.name);
        setIsFetchingPANDetails(false);
      }
    } catch (err) {
      setValidUser(null);
      if (err?.response?.status === 422) {
        form.setErrors(err?.response?.data?.errors);
        setIsFetchingPANDetails(false);
        setValidUser(null);
      } else if (err?.error) {
        form.setErrors(err?.error);
        setIsFetchingPANDetails(false);
        setValidUser(null);
      } else {
        setIsFetchingPANDetails(false);
        setValidUser(null);
      }
    }
  }, [form?.value?.pan]);

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
      throw err;
    }
  };

  const handleSkip = () => {
    navigation.replace('Protected');
  };

  return (
    <ScreenWrapper>
      <View style={{paddingHorizontal: 24, flex: 1}}>
        <View style={{marginTop: navigation.canGoBack() ? 24 : 41}}>
          {navigation.canGoBack() ? (
            <View style={{paddingBottom: 24}}>
              <TouchableOpacity
                hitSlop={{top: 30, left: 30, right: 30, bottom: 30}}
                onPress={() => navigation.canGoBack() && navigation.pop()}
                style={{flex: 0.3 / 4}}>
                <BackArrow />
              </TouchableOpacity>
            </View>
          ) : null}
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
              value={form.value.pan}
              keyboardType={keyboardType}
              editable={!isFetchingPANDetails}
              overlappingIcon={() =>
                isFetchingPANDetails && (
                  <View style={{position: 'absolute', right: 13.24}}>
                    <ActivityIndicator color={theme.colors.primaryBlue} />
                  </View>
                )
              }
              autoCapitalize={
                keyboardType === 'default' ? 'characters' : 'none'
              }
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

          {form.errors.get('pan') ? (
            <>
              {Array.isArray(form.errors.get('pan')) &&
              form.errors.get('pan')?.length > 1 ? (
                form.errors
                  .get('pan')
                  ?.map((errMsg, index) => (
                    <InputErrorMessage
                      key={`error-msg-${index}`}
                      errorMessage={errMsg}
                    />
                  ))
              ) : Array.isArray(form.errors.get('pan')) &&
                form.errors.get('pan')?.length === 0 ? (
                <>
                  <InputErrorMessage
                    errorMessage={`${form.errors.get('pan')?.[0]}`}
                  />
                </>
              ) : (
                <>
                  <InputErrorMessage
                    errorMessage={`${form.errors.get('pan')}`}
                  />
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
