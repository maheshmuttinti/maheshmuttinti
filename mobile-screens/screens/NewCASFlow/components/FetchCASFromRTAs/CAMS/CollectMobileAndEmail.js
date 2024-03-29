/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useEffect, useCallback, useState, useRef} from 'react';
import {View, Text} from 'react-native';
import {AuthHeading, BaseTextInput, BaseButton, TextButton} from 'uin';
import {useTheme} from 'theme';
import {WarningIcon1, TickCircle, PentagonDangerIcon} from 'assets';
import useBetaForm from '@reusejs/react-form-hook';
import {useFocusEffect} from '@react-navigation/native';
import {
  EMAIL_REGEX,
  NUMBER_MATCH_REGEX,
  INDIA_ISD_NUMBER_REGEX,
  debugLog,
} from 'utils';
import {useHandleCASFetching} from '../../../../../reusables/CASFetching/useHandleCASFetching';
import Config from 'react-native-config';

// const errMsg =
//   'The phone number and email address aren’t matching at the CAMS system. Please enter the correct email and mobile number.';

export const CollectMobileAndEmail = ({
  onSkip = () => {},
  onSubmit = () => {},
  onLoading = () => {},
  onError = () => {},
  incrementCurrentStep,
}) => {
  const theme = useTheme();
  const [showGreenCircleIconForMobile, setShowGreenCircleIconForMobile] =
    useState(false);
  const [showGreenCircleIconForEmail, setShowGreenCircleIconForEmail] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const limit10Digit = useRef(() => {});

  const initiateCAMSCASForm = useBetaForm({
    credentials: 'custom',
    data_fetching_provider: 'cams',
    email: '',
    mobile: '',
    fi_code: `${Config.DEFAULT_NBFC_CODE}`,
  });

  const {handleInitiateCASRequest} = useHandleCASFetching();

  const form = useBetaForm({
    type: '',
    value: '',
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
    casEmailForm.setField('email', '');
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
    setErrorMessage(null);
    let numberMatch = NUMBER_MATCH_REGEX.test(text.trim());
    if (!numberMatch) {
      form.setField('type', 'mobile_number');
      form.setField('value', text.trim());
    }
  };

  const handleValidateEmail = text => {
    casEmailForm.setErrors({});
    setErrorMessage(null);
    let emailMatch = EMAIL_REGEX.test(text.trim());
    if (emailMatch) {
      casEmailForm.setField('email', text.trim());
      setShowGreenCircleIconForEmail(true);
    } else {
      casEmailForm.setField('email', text.trim());
      setShowGreenCircleIconForEmail(false);
    }
  };

  const handleInitiateCASRequestForRedirection = async () => {
    try {
      clearFormErrors();
      casEmailForm.setErrors({});

      let emailMatch = EMAIL_REGEX.test(casEmailForm.value.email.trim());
      let numberMatch = INDIA_ISD_NUMBER_REGEX.test(
        `+91${form.value.value.trim()}`,
      );

      if (casEmailForm.value.email.length === 0) {
        casEmailForm.setErrors({email: 'Please enter Email ID'});
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
        const payload = {
          ...initiateCAMSCASForm?.value,
          email: casEmailForm.value.email,
          mobile: form.value.value,
        };

        debugLog(
          'payload-112233 for CAMS Custom Flow------------------',
          payload,
        );
        onLoading(true);

        const handleInitiateCASRequestResponse = await handleInitiateCASRequest(
          payload,
        );
        debugLog(
          'handleInitiateCASRequestResponse in email and phone-------CAMS: ',
          handleInitiateCASRequestResponse,
        );
        onSubmit(handleInitiateCASRequestResponse);
        onLoading(false);
      }
    } catch (error) {
      onLoading(false);
      debugLog(
        'handleInitiateCASRequestForRedirection-error',
        error,
        error?.response?.status,
      );
      if (error?.response?.status === 422) {
        // Todo: Set the Form Errors
      } else {
        onError(error);
      }
      throw error;
    }
  };

  return (
    <>
      <View style={{flex: 1}}>
        <AuthHeading>CAMS Verification</AuthHeading>

        <View style={{paddingTop: 16}}>
          {errorMessage ? (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View>
                <PentagonDangerIcon fill={theme.colors.error} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  width: '90%',
                }}>
                <Text
                  style={{
                    ...theme.fontSizes.medium,
                    fontWeight: theme.fontWeights.moreBold,
                    color: theme.colors.error,
                    fontFamily: theme.fonts.regular,
                    paddingLeft: 16,
                  }}>
                  The phone number and email address aren’t matching at the CAMS
                  system. Please enter the correct email and mobile number.
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        <View style={{paddingTop: 24}}>
          <BaseTextInput
            placeholder="Email ID"
            label="EMAIL"
            labelStyles={{
              color: theme.colors.primaryBlue,
              ...theme.fontSizes.small,
            }}
            onChangeText={text => handleValidateEmail(text)}
            extraTextStyle={{paddingLeft: 24}}
            value={casEmailForm.getField('email')}
            error={casEmailForm.errors.get('email')}
            overlappingIcon={() =>
              (casEmailForm.errors.get('email') && <InputWarningIcon />) ||
              (showGreenCircleIconForEmail && <InputTickIcon />)
            }
          />

          <View style={{paddingTop: 24}}>
            <BaseTextInput
              placeholder={form.value.type !== 'mobile_number' ? '+91' : ''}
              label="PHONE NUMBER"
              labelStyles={{
                color: theme.colors.primaryBlue,
                ...theme.fontSizes.small,
              }}
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
      </View>

      <View
        style={{
          paddingTop: 16,
          justifyContent: 'flex-end',
        }}>
        <View style={{}}>
          <BaseButton
            onPress={async () => {
              await handleInitiateCASRequestForRedirection();
            }}>
            Submit
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
            onPress={() => {
              onSkip();
            }}>
            Skip CAMS verification
          </TextButton>
        </View>
      </View>
    </>
  );
};

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
