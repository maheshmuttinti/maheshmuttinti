/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View} from 'react-native';
import {
  AuthHeading,
  BaseButton,
  TextButton,
  BlackBodyText,
  GrayBodyText,
} from 'uin';
import {useTheme} from 'theme';
import AuthWrapper from '../../../hocs/AuthWrapper';
import {ReadEmailSvg} from 'assets';
import {
  updateUserProfile,
  getUser,
  requestCAS,
  addCASEmail,
  gmailPermission,
} from 'services';
import {prettifyJSON, showToast, openBrowser} from 'utils';
import useExitApp from '../../../reusables/useExitApp';
import useUser from '../../../reusables/useUser';
import useGetCASEmails from '../../../reusables/useGetCASEmails';
import useOnboardingHandleRedirection from '../../../reusables/useOnboardingHandleRedirection';

export default function ({navigation}) {
  const theme = useTheme();
  const [processing, setProcessing] = useState(false);

  let user = useUser();

  let casEmails = useGetCASEmails();
  const {handleUpdateOnboardingStep} = useOnboardingHandleRedirection();

  useExitApp();

  const handleOpenGmailAccountsScreen = async () => {
    try {
      const url = await gmailPermission();
      await openBrowser(url);
    } catch (error) {
      return error;
    }
  };

  const handleRequestCAS = async requestCASPayload => {
    try {
      const requestCASResponse = await requestCAS(requestCASPayload);
      return requestCASResponse;
    } catch (error) {
      showToast('Something went wrong');
    }
  };

  const handleAddCASEmailAndRequest = async (
    usernameType,
    casEmail,
    updatedUserProfile,
  ) => {
    try {
      let _casEmail = casEmail;
      console.log('casEmail', casEmail);
      if (
        Array.isArray(casEmail) &&
        casEmail.length > 0 &&
        casEmail[0]['cas_emails*email'] &&
        casEmail[0]['cas_emails*verification_status'] === 'success'
      ) {
        console.log(
          'different kind of email coming here',
          casEmail[0]['cas_emails*email'],
        );
        _casEmail = casEmail[0]['cas_emails*email'];
      }
      let addCASEmailPayload = {
        email: _casEmail,
        email_type: '',
      };
      if (usernameType === 'apple_id') {
        addCASEmailPayload.email_type = 'non_gmail';
        addCASEmailPayload.verification_status = 'success';
      }
      if (usernameType === 'non_gmail') {
        addCASEmailPayload.email_type = 'non_gmail';
      }

      if (updatedUserProfile) {
        if (updatedUserProfile?.profile?.meta?.username_type === 'apple_id') {
          addCASEmailPayload.email_type = 'non_gmail';
          addCASEmailPayload.verification_status = 'success';
        }
        if (updatedUserProfile?.profile?.meta?.username_type === 'non_gmail') {
          addCASEmailPayload.email_type = 'non_gmail';
        }
      }

      if (usernameType === 'gmail') {
        await handleOpenGmailAccountsScreen();
      } else {
        console.log('addCASEmailPayload---', addCASEmailPayload);
        const addCasEmailResponse = await addCASEmail(addCASEmailPayload);

        if (addCasEmailResponse?.message === 'EMAIL_ADDED') {
          let requestCASPayload = {email: addCasEmailResponse?.data?.email};

          const requestCASResponse = await handleRequestCAS(requestCASPayload);
          if (requestCASResponse?.message) {
            showToast(requestCASResponse?.message);
            await handleUpdateOnboardingStep(user, {
              consolidate_mutual_funds_linked_to_email: {
                status: 'completed',
                data: {
                  email: addCasEmailResponse?.data?.email,
                  email_type: addCasEmailResponse?.data?.email_type,
                },
              },
            });

            setProcessing(false);
            navigation.replace('Onboarding', {
              screen: 'PermissionsEmailSentScreen',
            });
          }
        } else {
          setProcessing(false);
          showToast('Something went wrong');
        }
        setProcessing(false);
      }
    } catch (error) {
      console.log('error came in handleAddCASEmailAndRequest method', error);
      return error;
    }
  };

  const getCASEmail = (userProfile, casEmailsObject) => {
    try {
      const isCasEmailsExists = casEmailsObject && casEmailsObject?.length > 0;

      const isNonGmailCASEmailPresent = !!(
        isCasEmailsExists &&
        casEmailsObject?.find(
          item => item['cas_emails*email_type'] === 'non_gmail',
        )
      );

      const isEmailAttributePresent = userProfile?.attributes?.find(
        item => item.type === 'email',
      );

      const emailFromUserAttributes =
        isEmailAttributePresent &&
        userProfile?.attributes?.find(item => item.type === 'email')?.value;

      console.log('emailFromUserAttributes', emailFromUserAttributes);

      const emailFromCASTable =
        isNonGmailCASEmailPresent &&
        casEmailsObject?.find(
          item => item['cas_emails*email_type'] === 'non_gmail',
        )['cas_emails*email'];

      console.log('emailFromCASTable', emailFromCASTable);

      let casEmail = emailFromUserAttributes || emailFromCASTable;
      console.log('casEmail**********', casEmail);
      return casEmail;
    } catch (error) {
      console.log('error came in getCASEmail method', error);
      return error;
    }
  };

  const handleRedirectionCallback = async () => {
    try {
      setProcessing(true);

      user = await getUser();

      console.log('user is', prettifyJSON(user));
      console.log('casEmails are', prettifyJSON(casEmails));

      let usernameTypes = ['gmail', 'non_gmail', 'apple_id'];

      const isUserNameTypeExists =
        typeof user?.profile?.meta?.username_type === 'string' &&
        usernameTypes?.includes(user?.profile?.meta?.username_type);

      // const isCasEmailNotAddedOrNotFoundInCasEmailsTable =
      //   !casEmails || casEmails?.length === 0;

      const isCasEmailsExists = casEmails && casEmails?.length > 0;

      console.log('isUserNameTypeExists', isUserNameTypeExists);
      console.log('isCasEmailsExists', isCasEmailsExists);

      const casEmail = await getCASEmail(user, casEmails);

      console.log('casEmail===========', casEmail);

      // --------

      const isUserNameTypeNonGmail =
        user?.profile?.meta?.username_type === 'non_gmail';

      const isUserNameTypeGmail =
        user?.profile?.meta?.username_type === 'gmail';

      const isUserNameTypeAppleId =
        user?.profile?.meta?.username_type === 'apple_id';

      const isCASEmailTypeGmail = !!(
        isCasEmailsExists &&
        casEmails?.find(item => item['cas_emails*email_type'] === 'gmail')
      );

      const isCASEmailTypeAppleId = !!(
        isCasEmailsExists &&
        casEmails?.find(item => item['cas_emails*email_type'] === 'apple_id')
      );

      const isCASEmailTypeNonGmail = !!(
        isCasEmailsExists &&
        casEmails?.find(item => item['cas_emails*email_type'] === 'non_gmail')
      );

      const isUserAttributesHasEmail = user?.attributes
        .map(item => item.type)
        .includes('email');

      const isCASEmailVerificationPending = !!(
        isCasEmailsExists &&
        casEmails?.find(
          item => item['cas_emails*verification_status'] === 'pending',
        )
      );

      const isCASEmailVerificationSuccess = !!(
        isCasEmailsExists &&
        casEmails?.find(
          item => item['cas_emails*verification_status'] === 'success',
        )
      );

      const isCasEmailNotVerified =
        isCASEmailTypeNonGmail && isCASEmailVerificationPending;

      const isCasEmailVerified = !!(
        (isCASEmailTypeNonGmail && isCASEmailVerificationSuccess) ||
        isCASEmailTypeGmail ||
        isCASEmailTypeAppleId
      );

      const isCasEmailAddedNonGmailType =
        isUserNameTypeNonGmail || isUserAttributesHasEmail || isCasEmailsExists;

      const isCasEmailAddedGmailType =
        isUserNameTypeGmail || isUserAttributesHasEmail || isCasEmailsExists;

      const isCasEmailAddedAppleIdType =
        isUserNameTypeAppleId || isUserAttributesHasEmail || isCasEmailsExists;

      if (isCasEmailAddedNonGmailType && isCasEmailNotVerified) {
        setProcessing(false);
        navigation.replace('EmailActivationLinkScreen');
      } else if (
        isUserNameTypeExists &&
        ((isCasEmailAddedNonGmailType && isCasEmailVerified) ||
          isCasEmailAddedGmailType ||
          isCasEmailAddedAppleIdType)
      ) {
        let userNameType = user?.profile?.meta?.username_type;
        await handleAddCASEmailAndRequest(userNameType, casEmail);
        setProcessing(false);
      } else if (!isUserNameTypeExists) {
        console.log('no user name present condition');
        let userNameType = 'no_username_type';
        if (isCasEmailAddedNonGmailType) {
          userNameType = 'non_gmail';
        }
        if (isCasEmailAddedAppleIdType) {
          userNameType = 'apple_id';
        }

        let updateUserNameTypePayload = {
          meta: {
            ...user?.profile?.meta,
            username_type: userNameType,
          },
        };

        const updatedProfileResponse = await updateUserProfile(
          updateUserNameTypePayload,
        );

        if (
          updatedProfileResponse?.profile?.meta?.username_type === 'gmail' ||
          updatedProfileResponse?.profile?.meta?.username_type ===
            'non_gmail' ||
          updatedProfileResponse?.profile?.meta?.username_type === 'apple_id'
        ) {
          await handleAddCASEmailAndRequest(
            userNameType,
            casEmails,
            updatedProfileResponse,
          );
          setProcessing(false);
        } else {
          setProcessing(false);
          showToast('Something went wrong!');
        }
      }
      // else if (
      //   isCasEmailNotAddedOrNotFoundInCasEmailsTable &&
      //   user?.profile?.meta?.username_type === 'mobile_number'
      // ) {
      //   setProcessing(false);
      //   navigation.replace('Auth', {screen: 'AddEmailIdScreen'});
      // }
      else {
        setProcessing(false);
        navigation.replace('Protected');
      }

      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      showToast('Something went wrong');
      console.log('error', err);
      return err;
    }
  };

  return (
    <AuthWrapper onBackPress={() => {}}>
      <AuthHeading>Welcome!</AuthHeading>

      <View style={{paddingTop: 24}}>
        <ReadEmailSvg />
      </View>

      <View style={{paddingTop: 24}}>
        <BlackBodyText style={{fontWeight: theme.fontWeights.veryBold}}>
          Great to have you on FinEzzy...
        </BlackBodyText>
      </View>

      <View style={{paddingTop: 24}}>
        <GrayBodyText
          style={{
            fontFamily: theme.fonts.regular,
          }}>
          We promise to simplify and personalize your financial life. As a first
          step, lets consolidate your Mutual Funds linked to your email.
        </GrayBodyText>
      </View>

      <View style={{paddingTop: 24}}>
        <GrayBodyText
          style={{
            fontFamily: theme.fonts.regular,
          }}>
          All holdings at one single place with Insightful Reports and Advice...
        </GrayBodyText>
      </View>

      <View style={{paddingTop: 32}}>
        <BaseButton
          disable={processing}
          loading={processing}
          onPress={() => handleRedirectionCallback()}>
          Sounds great, Lets do this!
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
          disable={processing}
          onPress={() => {
            !processing && navigation.replace('Protected');
          }}>
          I don't have MF investments
        </TextButton>
      </View>
    </AuthWrapper>
  );
}
