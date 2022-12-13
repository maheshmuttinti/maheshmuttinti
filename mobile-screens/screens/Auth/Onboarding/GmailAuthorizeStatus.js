/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useRef, useCallback, useState} from 'react';
import {View, Text} from 'react-native';
import {requestCAS, addCASEmail, getUser} from 'services';
import {useFocusEffect} from '@react-navigation/native';
import {useTheme} from 'theme';
import {showToast} from 'utils';
import {AnimatedEllipsis} from 'uin';
import useOnboardingHandleRedirection from '../../../reusables/useOnboardingHandleRedirection';
import useGetCASEmails from '../../../reusables/useGetCASEmails';

export default function ({navigation, route}) {
  const theme = useTheme();

  let casEmails = useGetCASEmails();
  const {handleUpdateOnboardingStep} = useOnboardingHandleRedirection();

  const code = route?.params?.code;

  const [apiCallStatus, setApiCallStatus] = useState(null);

  const getUserFnRef = useRef(() => {});

  const requestCASCallback = async (user, emailToBeForCasApply) => {
    try {
      const requestCASPayload = {
        email: emailToBeForCasApply,
      };

      const requestCASResponse = await requestCAS(requestCASPayload);

      if (requestCASResponse?.message) {
        showToast(requestCASResponse?.message);
        return requestCASResponse?.message;
      }
      return requestCASResponse;
    } catch (error) {
      showToast(error.response.data.message || 'Something went wrong');
      if (error.response.data.message === 'NO_CAS_EMAIL') {
        showToast(
          'Please select correct email address that you have logged in with',
        );
        navigation.goBack();
      } else {
        if (
          user?.profile?.meta?.onboarding_steps?.risk_profiling?.status ===
          'completed'
        ) {
          navigation.replace('Protected');
        } else {
          const isInvestmentBehaviorStepSkipped =
            user?.profile?.meta?.onboarding_steps?.investment_behavior
              ?.status === 'skipped';

          const isInvestmentBehaviorStepCompleted =
            user?.profile?.meta?.onboarding_steps?.investment_behavior
              ?.status === 'completed';
          if (
            isInvestmentBehaviorStepSkipped ||
            isInvestmentBehaviorStepCompleted ||
            !user?.profile?.meta?.onboarding_steps?.investment_behavior
              ?.status ||
            !user?.profile?.meta?.onboarding_steps
          ) {
            navigation.replace('Onboarding', {
              screen: 'PermissionsEmailSentScreen',
            });
          } else {
            navigation.replace('Onboarding', {
              screen: 'EnterDobScreen',
            });
          }
        }
      }
    }
  };

  const handleRequestCAS = async () => {
    try {
      const user = await getUser();
      let emailToBeForCasApply =
        user?.attributes?.find(item => item.type === 'email')?.value ||
        (casEmails &&
          casEmails?.length > 0 &&
          casEmails?.find(
            item => item['cas_emails*email_type'] === 'non_gmail',
          )['cas_emails*email']);

      const addCASEmailPayload = {
        email: emailToBeForCasApply,
        email_type: 'gmail',
        code: code,
      };
      setApiCallStatus('requesting_cas');

      const addCasEmailResponse = await addCASEmail(addCASEmailPayload);

      if (addCasEmailResponse?.message === 'EMAIL_ADDED') {
        const res = await requestCASCallback(user, addCASEmailPayload.email);

        if (res) {
          setApiCallStatus('updating_profile');

          const updateProfileResponse = await handleUpdateOnboardingStep(user, {
            consolidate_mutual_funds_linked_to_email: {
              status: 'completed',
              data: {
                email: addCasEmailResponse?.data?.email,
                email_type: addCasEmailResponse?.data?.email_type,
              },
            },
          });

          if (updateProfileResponse) {
            setApiCallStatus('success');
            if (
              updateProfileResponse?.profile?.meta?.onboarding_steps
                ?.risk_profiling?.status === 'completed'
            ) {
              navigation.replace('Protected');
            } else {
              const isInvestmentBehaviorStepSkipped =
                user?.profile?.meta?.onboarding_steps?.investment_behavior
                  ?.status === 'skipped';

              const isInvestmentBehaviorStepCompleted =
                user?.profile?.meta?.onboarding_steps?.investment_behavior
                  ?.status === 'completed';
              if (
                isInvestmentBehaviorStepSkipped ||
                isInvestmentBehaviorStepCompleted ||
                !user?.profile?.meta?.onboarding_steps?.investment_behavior
                  ?.status ||
                !user?.profile?.meta?.onboarding_steps
              ) {
                navigation.replace('Onboarding', {
                  screen: 'PermissionsEmailSentScreen',
                });
              } else {
                navigation.replace('Onboarding', {
                  screen: 'EnterDobScreen',
                });
              }
            }
          }
        }
      }
    } catch (err) {
      setApiCallStatus('failed');
      navigation.goBack();
      return err;
    }
  };

  getUserFnRef.current = async () => {
    try {
      await handleRequestCAS();
    } catch (error) {
      return error;
    }
  };

  useFocusEffect(
    useCallback(() => {
      getUserFnRef.current();
    }, []),
  );

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background || '#fff',
      }}>
      <AnimatedEllipsis dotSize={12} dotColor={theme.colors.primaryBlue} />
      {apiCallStatus === 'requesting_cas' && (
        <Text
          style={{
            color: theme.colors.text,
            fontFamily: theme.fonts.regular,
            paddingTop: 16,
            textAlign: 'center',
          }}>
          Requesting CAS Statement...
        </Text>
      )}
    </View>
  );
}
