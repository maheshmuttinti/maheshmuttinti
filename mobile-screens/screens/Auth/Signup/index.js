/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useEffect, useCallback, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, Linking, Platform} from 'react-native';
import {
  GrayBodyText,
  AuthHeading,
  BaseTextInput,
  BaseButton,
  SubText,
  TextButton,
  GroupText,
  GoogleButton,
  AppleButton,
} from 'uin';
import {useTheme} from 'theme';
import AuthWrapper from '../../../hocs/AuthWrapper';
import {Separator, WarningIcon1, TickCircle} from 'assets';
import {appleLogin, googleLogin, register} from 'services';
import {openBrowser} from 'utils';
import useBetaForm from '@reusejs/react-form-hook';
import {useFocusEffect} from '@react-navigation/native';
import {
  EMAIL_REGEX,
  NUMBER_MATCH_REGEX,
  INDIA_ISD_NUMBER_REGEX,
  getUserPassword,
} from 'utils';
import Config from 'react-native-config';

export default function SignupOptionsScreen({navigation}) {
  const theme = useTheme();
  const [showGreenCircleIconForMobile, setShowGreenCircleIconForMobile] =
    useState(false);
  const [showGreenCircleIconForEmail, setShowGreenCircleIconForEmail] =
    useState(false);
  const [apiCallStatus, setApiCallStatus] = useState(null);
  const limit10Digit = useRef(() => {});

  const form = useBetaForm({
    type: '',
    value: '',
    password: '',
  });

  const casEmailForm = useBetaForm({
    email: '',
  });

  limit10Digit.current = () => {
    form.setField('value', form.value.value.slice(0, 10));
  };

  const showGreenTickCircleIcon = showIcon => {
    setShowGreenCircleIconForMobile(showIcon);
  };

  const clearFormErrors = () => {
    form.setErrors({});
  };
  const clearCASEmailFormErrors = () => {
    casEmailForm.setErrors({});
  };

  const clearForms = () => {
    form.setField('type', '');
    form.setField('value', '');
    form.setField('password', '');
    casEmailForm.setField('email', '');
  };

  useFocusEffect(
    useCallback(() => {
      clearFormErrors();
      clearCASEmailFormErrors();
      return () => {
        clearForms();
        clearFormErrors();
        clearCASEmailFormErrors();
      };
    }, []),
  );

  const handleValidatePhoneNumber = text => {
    clearFormErrors();
    let numberMatch = NUMBER_MATCH_REGEX.test(text.trim());
    if (!numberMatch) {
      form.setField('type', 'mobile_number');
      form.setField('value', text.trim());
    }
  };

  const handleValidateEmail = text => {
    casEmailForm.setErrors({});
    let emailMatch = EMAIL_REGEX.test(text.trim());
    if (emailMatch) {
      casEmailForm.setField('email', text.trim());
      setShowGreenCircleIconForEmail(true);
    } else {
      casEmailForm.setField('email', text.trim());
      setShowGreenCircleIconForEmail(false);
    }
  };

  useEffect(() => {
    if (isNaN(form.value.value)) {
      form.setErrors({value: 'Please enter a valid phone number'});
    }
    if (form.value.type === 'mobile_number' && form.value.value.length >= 10) {
      limit10Digit.current();
    }
    if (form.value.type === 'mobile_number' && form.value.value.length === 10) {
      showGreenTickCircleIcon(true);
    } else {
      showGreenTickCircleIcon(false);
    }
  }, [form.value.value, form.value.type]);

  const handleGoogleLogin = async () => {
    try {
      const data = await googleLogin();
      const url = data?.redirect_to;
      await openBrowser(url);
    } catch (error) {
      return error;
    }
  };

  const handleAppleLogin = async () => {
    try {
      const data = await appleLogin();
      const url = data?.redirect_to;
      await openBrowser(url);
    } catch (error) {
      return error;
    }
  };

  const handleSignup = async () => {
    try {
      clearFormErrors();
      casEmailForm.setErrors({});

      let emailMatch = EMAIL_REGEX.test(casEmailForm.value.email.trim());
      let numberMatch = INDIA_ISD_NUMBER_REGEX.test(
        `+91${form.value.value.trim()}`,
      );

      if (casEmailForm.value.email.length === 0) {
        casEmailForm.setErrors({email: 'Please enter email ID'});
      } else {
        if (emailMatch) {
          casEmailForm.setField('email', casEmailForm.value.email.trim());
          setShowGreenCircleIconForEmail(true);
        } else {
          casEmailForm.setErrors({email: 'Please enter valid email ID'});
        }
      }
      if (form.value.value.length === 0) {
        form.setErrors({value: 'Please enter phone number'});
      } else {
        if (numberMatch && !isNaN(form.value.value.slice(3))) {
          form.setField('value', form.value.value.trim());
          setShowGreenCircleIconForMobile(true);
        } else {
          form.setErrors({value: 'Please enter a valid phone number'});
        }
      }

      if (emailMatch && numberMatch) {
        let userName =
          form.value.type === 'mobile_number'
            ? `+91${form.value.value}`
            : form.value.value;

        let generatedPassword = await getUserPassword(userName);
        console.log('generatedPassword-1234', generatedPassword);

        let payload = {
          type: form?.value?.type,
          value: form?.value?.value,
          password: generatedPassword,
        };

        console.log('payload-112233', payload);
        setApiCallStatus('loading');

        const response = await register(payload);
        if (
          response.message === 'Already Registered' ||
          response.message === 'Successfully Registered'
        ) {
          setApiCallStatus('success');
          clearFormErrors();
          clearCASEmailFormErrors();
          clearForms();
          setShowGreenCircleIconForEmail(false);
          setShowGreenCircleIconForMobile(false);
          navigation.navigate('VerifyPhoneNumberDuringRegistration', {
            value:
              form.value.type === 'mobile_number'
                ? '+91' + form.value.value
                : form.value.value,
            type: form.value.type,
            casEmail: casEmailForm.value.email,
          });
        }
      }
    } catch (error) {
      console.log('handleSignup-error', error);
      setApiCallStatus('failed');
      if (error?.errors?.value[0] === 'Value should be unique') {
        form.setErrors({value: 'Already registered'});
      } else {
        form.setErrors(error);
      }
    }
  };

  return (
    <AuthWrapper>
      <AuthHeading>Enhance your Financial Well-Being!</AuthHeading>

      <View style={{paddingTop: 18}}>
        <GrayBodyText>
          Join in with your e-mail linked to Investments for Analysis, Insights
          and More...
        </GrayBodyText>
      </View>

      <View style={{paddingTop: 24}}>
        <BaseTextInput
          placeholder="Email"
          onChangeText={text => handleValidateEmail(text)}
          extraTextStyle={{paddingLeft: 24}}
          value={casEmailForm.getField('email')}
          error={casEmailForm.errors.get('email')}
          overlappingIcon={() =>
            (casEmailForm.errors.get('email') && <InputWarningIcon />) ||
            (showGreenCircleIconForEmail && <InputTickIcon />)
          }
        />

        <View style={{paddingTop: 16}}>
          <BaseTextInput
            placeholder="Phone number"
            onChangeText={text => handleValidatePhoneNumber(text)}
            keyboardType="numeric"
            extraTextStyle={
              form.value.type === 'mobile_number'
                ? {paddingLeft: 50}
                : {paddingLeft: 24}
            }
            value={form.getField('value')}
            error={form.errors.get('value')}
            prefixComponent={() =>
              form.value.type === 'mobile_number' && <PrefixComponent />
            }
            overlappingIcon={() =>
              (form.errors.get('value') && <InputWarningIcon />) ||
              (showGreenCircleIconForMobile && <InputTickIcon />)
            }
          />
        </View>
      </View>

      <GroupText
        style={{
          flexDirection: 'row',
          width: '100%',
          marginTop: 24,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'flex-start',
          }}>
          <SubText style={{color: theme.colors.bodyGray}}>
            By clicking the{' '}
          </SubText>

          <SubText style={{color: theme.colors.primaryOrange800}}>
            Sign Up{' '}
          </SubText>

          <SubText style={{color: theme.colors.bodyGray}}>
            button, you agree to the{' '}
          </SubText>
        </View>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(`${Config.FINEZZY_TERMS_AND_CONDITIONS_URL}`);
          }}
          style={{
            alignSelf: 'flex-start',
          }}>
          <SubText
            style={{
              color: theme.colors.primaryBlue800,
              textDecorationLine: 'underline',
              alignSelf: 'flex-start',
            }}>
            terms and conditions{' '}
          </SubText>
        </TouchableOpacity>
      </GroupText>
      <View style={{paddingTop: 16}}>
        <BaseButton
          loading={apiCallStatus === 'loading'}
          onPress={() => {
            handleSignup();
          }}>
          Sign Up
        </BaseButton>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 24,
        }}>
        <Separator />
        <Text style={{marginHorizontal: 8, color: theme.colors.bodyGray}}>
          or
        </Text>
        <Separator />
      </View>

      {Platform.OS === 'ios' && (
        <View
          style={{
            paddingTop: 24,
            flexDirection: 'row',
          }}>
          <View style={{flex: 1 / 2}}>
            <AppleButton onPress={() => handleAppleLogin()} />
          </View>
          <View style={{flex: 1 / 2, marginLeft: 16}}>
            <GoogleButton onPress={() => handleGoogleLogin()} />
          </View>
        </View>
      )}

      {Platform.OS === 'android' && (
        <View style={{paddingTop: 24}}>
          <GoogleButton
            isSingleButton={true}
            onPress={() => handleGoogleLogin()}>
            Continue with Google
          </GoogleButton>
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 24,
        }}>
        <TextButton onPress={() => navigation.navigate('SigninHome')}>
          Already Registered?
        </TextButton>
      </View>
    </AuthWrapper>
  );
}

const PrefixComponent = () => {
  const theme = useTheme();
  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 2,
        left: 24,
      }}>
      <Text
        style={{
          color: theme.colors.text,
        }}>
        +91
      </Text>
    </View>
  );
};

/* we can write it in a separate file if this icon is used in multiple input fields */
const InputWarningIcon = () => {
  return (
    <View style={{position: 'absolute', right: 13.24}}>
      <WarningIcon1 />
    </View>
  );
};

/* we can write it in a separate file if this icon is used in multiple input fields */
const InputTickIcon = () => {
  return (
    <View style={{position: 'absolute', right: 13.24}}>
      <TickCircle />
    </View>
  );
};
