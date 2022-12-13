import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {getUser, updateUserProfile} from 'services';
import useGetCASEmails from './useGetCASEmails';

const useOnboardingHandleRedirection = () => {
  const navigation = useNavigation();
  const casEmails = useGetCASEmails();

  const handleUpdateOnboardingStep = async (user, payload) => {
    try {
      const meta = {
        meta: {
          ...user?.profile?.meta,
          onboarding_steps: {
            ...user?.profile?.meta.onboarding_steps,
            ...payload,
          },
        },
      };
      const updateProfilePayload = {
        ...meta,
      };

      const updateProfileResponse = await updateUserProfile(
        updateProfilePayload,
      );
      return updateProfileResponse;
    } catch (error) {
      console.log(
        'error while updating the profile on handleUpdateOnboardingStep function',
        error,
      );
    }
  };

  const handleRedirection = async latestUser => {
    let tokenFromStorage = await AsyncStorage.getItem('@access_token');

    if (tokenFromStorage !== null) {
      const user = latestUser || (await getUser());

      const isUsernameTypeExists = !!user?.profile?.meta?.username_type;

      // Todo: Show the Email and Phone Number for RTA Fetching CAS flow
      const isMobileNumberExists = user?.attributes
        .map(item => item.type)
        .includes('mobile_number');

      // cas emails conditions
      // ---------------------

      const isCASEmailsArePresent = casEmails && casEmails.length > 0;

      const isCASEmailIsNonGmail =
        isCASEmailsArePresent &&
        casEmails?.find(item => item['cas_emails*email_type'] === 'non_gmail');

      const isCASEmailIsGmail =
        isCASEmailsArePresent &&
        casEmails?.find(item => item['cas_emails*email_type'] === 'gmail');

      const isCASEmailVerificationSuccess =
        isCASEmailsArePresent &&
        casEmails?.find(item => item['cas_emails*verification_status']) &&
        casEmails?.find(
          item => item['cas_emails*verification_status'] === 'success',
        );

      const isNonGmailCASEmailVerified =
        isCASEmailIsNonGmail && isCASEmailVerificationSuccess;

      const isCasEmailVerified =
        isNonGmailCASEmailVerified || isCASEmailIsGmail;

      //  All Onboarding Steps completed

      const isOnboardingStepsCompleted =
        isUsernameTypeExists && isCasEmailVerified;

      if (isOnboardingStepsCompleted) {
        console.log(
          'if->isOnboardingStepsCompleted: ',
          isOnboardingStepsCompleted,
        );
        navigation.replace('Protected');
      } else {
        console.log(
          'else->isOnboardingStepsCompleted: ',
          isOnboardingStepsCompleted,
        );
        navigation.replace('Protected');
      }
    }
  };
  return {handleRedirection, handleUpdateOnboardingStep};
};

export default useOnboardingHandleRedirection;
