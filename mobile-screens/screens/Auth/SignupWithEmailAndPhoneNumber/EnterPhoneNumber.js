/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {
  AuthHeading,
  GrayBodyText,
  BaseTextInput,
  BaseButton,
  TextButton,
} from 'uin';
import AuthWrapper from '../../../hocs/AuthWrapperWithOrWithoutBackButton';
import {TickCircle, WarningIcon1} from 'assets';
import useExitApp from '../../../reusables/useExitApp';
import {NUMBER_MATCH_REGEX, prettifyJSON} from 'utils';
import {logout, updateAttribute} from 'services';
import useBetaForm from '@reusejs/react-form-hook';
import Ripple from 'react-native-material-ripple';
import {useTheme} from 'theme';
import {useClearAsyncStorageKeys} from '../../../reusables/useClearAsyncStorageKeys';
import {InputErrorMessage} from '../../../reusables/ErrorMessage';
import {useResetStack} from '../../../reusables/useResetStack';

export default function ({navigation}) {
  const [error, setError] = useState('');
  const [showGreenCircleIcon, setShowGreenCircleIcon] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const theme = useTheme();
  const [errorMessage, setErrorMessage] = useState(null);

  const {clearStoreForLogout} = useClearAsyncStorageKeys();
  const resetAuthStack = useResetStack('Auth');

  const form = useBetaForm({
    type: '',
    value: '',
  });

  const showGreenTickCircleIcon = () => {
    form.value.type === 'mobile_number' &&
    form.value.value.length === 10 &&
    !isNaN(form.value.value)
      ? setShowGreenCircleIcon(true)
      : setShowGreenCircleIcon(false);
  };


  useEffect(() => {
    showGreenTickCircleIcon();
  }, [form.value.value]);

  const handleChangeText = text => {
    console.log('text', text);
    setError(null);
    setErrorMessage(null);
    let numberMatch = NUMBER_MATCH_REGEX.test(text.trim());
    if (!numberMatch) {
      form.setField('type', 'mobile_number');
      form.setField('value', text.trim().slice(0, 10));
    }
  };

  const handleLogout = async () => {
    try {
      setDisableButton(true);
      const logoutResponse = await logout();
      console.log('logoutResponse', logoutResponse);
      clearStoreForLogout();
      resetAuthStack();
    } catch (err) {
      console.log('err while logout', err);
      return err;
    }
  };

  useExitApp();

  return (
    <AuthWrapper showBackArrowIcon={false}>
      <AuthHeading>Enter Your Phone Number</AuthHeading>

      <View style={{paddingTop: 16}}>
        <GrayBodyText>
          Your detailed portfolio analysis is just a phone number away
        </GrayBodyText>
      </View>

      <View style={{paddingTop: 24}}>
        <BaseTextInput
          placeholder="Phone Number"
          onChangeText={text => handleChangeText(text)}
          value={form.value.value}
          error={error}
          keyboardType="numeric"
          extraTextStyle={
            form.value.type === 'mobile_number'
              ? {paddingLeft: 50}
              : {paddingLeft: 24}
          }
          prefixComponent={() =>
            form.value.type === 'mobile_number' && (
              <View
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  left: 24,
                }}>
                <Text
                  style={{
                    color: '#212121',
                  }}>
                  +91
                </Text>
              </View>
            )
          }
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

      {errorMessage ? (
        <>
          <InputErrorMessage errorMessage={`${errorMessage}`} />
        </>
      ) : null}
      <VerifyMobileNumberButton
        navigation={navigation}
        phoneNumber={form.value.value}
        onEmptyPhoneNumberLength={() =>
          setError('Please enter the phone number')
        }
        payload={form.value}
        showGreenCircleIcon={showGreenCircleIcon}
        setError={setError}
        onError={message => setErrorMessage(message)}
      />

      <Ripple
        rippleColor={theme.colors.primaryBlue100}
        style={{width: '100%', marginTop: 12, alignItems: 'center'}}
        onPress={async () => {
          disableButton === true ? null : await handleLogout();
        }}>
        <TextButton
          style={{
            color: theme.colors.primaryBlue,
            fontWeight: theme.fontWeights.veryBold,
            paddingTop: 12,
            paddingBottom: 12,
          }}>
          Login as Other Account
        </TextButton>
      </Ripple>
    </AuthWrapper>
  );
}

export const VerifyMobileNumberButton = ({
  onActionIsCalling = () => false,
  navigation,
  phoneNumber,
  setError,
  showGreenCircleIcon,
  payload,
  onEmptyPhoneNumberLength = () => true,
  onError = () => {},
}) => {
  const [apiCallStatus, setApiCallStatus] = useState(null);

  const handleSubmit = async () => {
    try {
      setApiCallStatus('loading');
      onActionIsCalling(true);

      if (phoneNumber.length === 0) {
        console.log('empty phoneNumber');
        onEmptyPhoneNumberLength(true);
        onActionIsCalling(false);
        setApiCallStatus('failure');
      } else {
        if (showGreenCircleIcon) {
          onActionIsCalling(false);
          setApiCallStatus('success');
          const updateAttributePayload = {
            ...payload,
            value: `+91${payload.value}`,
          };
          console.log('payload isssss', updateAttributePayload);
          const updateAttributeResponse = await updateAttribute(
            updateAttributePayload,
          );
          console.log(
            'updateAttributeResponse',
            prettifyJSON(updateAttributeResponse),
          );
          navigation.navigate('VerifyPhoneNumberDuringSocialAuthentication', {
            ...updateAttributePayload,
          });
        } else {
          onActionIsCalling(false);
          setApiCallStatus('failure');
          setError('Please enter the valid phone number');
        }
      }
    } catch (err) {
      setApiCallStatus('failure');
      if (err.value[0] === 'Value should be unique') {
        onError(
          'Phone number already used by other account, Please try with another number.',
        );
      } else {
        onError('Something went wrong, Please try again.');
      }
      return err;
    }
  };

  return (
    <View style={{paddingTop: 32}}>
      <BaseButton
        loading={apiCallStatus === 'loading'}
        disable={!showGreenCircleIcon}
        onPress={() => handleSubmit()}>
        Continue
      </BaseButton>
    </View>
  );
};
