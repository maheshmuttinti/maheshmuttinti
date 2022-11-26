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

      // user profile data conditions
      // ---------------------------

      const isUsernameTypeExists = !!user?.profile?.meta?.username_type;

      const isMobileNumberExists = user?.attributes
        .map(item => item.type)
        .includes('mobile_number');

      const isUsernameTypeNonGmail =
        user?.profile?.meta?.username_type === 'non_gmail';

      const isUsernameTypeMobileNumber =
        user?.profile?.meta?.username_type === 'mobile_number';

      const isUsernameTypeGmail =
        user?.profile?.meta?.username_type === 'gmail';

      const isUsernameTypeAppleId =
        user?.profile?.meta?.username_type === 'apple_id';

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

      const isCASEmailRequested =
        casEmails?.find(item => item?.latest_cas_request !== null) &&
        casEmails?.find(item => item?.latest_cas_request !== null)
          ?.latest_cas_request['cas_requests*uuid'];

      const isUserRequestedCAS =
        isCASEmailsArePresent && isCasEmailVerified && isCASEmailRequested;

      // onboarding steps conditions
      // ---------------------------

      // 1. CAS Apply Step

      const isOnboardingCasEmailRequestCompleted =
        isUserRequestedCAS &&
        user?.profile?.meta?.onboarding_steps
          ?.consolidate_mutual_funds_linked_to_email?.status === 'completed';

      const isOnboardingCASApplyStateCompleted =
        (isMobileNumberExists &&
          isUsernameTypeNonGmail &&
          isOnboardingCasEmailRequestCompleted) ||
        (isMobileNumberExists &&
          isUsernameTypeMobileNumber &&
          isOnboardingCasEmailRequestCompleted) ||
        (isMobileNumberExists &&
          isUsernameTypeGmail &&
          isOnboardingCasEmailRequestCompleted) ||
        (isMobileNumberExists &&
          isUsernameTypeAppleId &&
          isOnboardingCasEmailRequestCompleted);

      // 2. Investment Behavior Step

      const isInvestmentBehaviorStepSkipped =
        user?.profile?.meta?.onboarding_steps?.investment_behavior?.status ===
        'skipped';

      const isInvestmentBehaviorStepCompleted =
        user?.profile?.meta?.onboarding_steps?.investment_behavior?.status ===
        'completed';

      const isCASRequestHasStatement = casEmails?.find(
        item => item?.statement_status !== null,
      );

      // 3. Risk Profiling Step

      const isRiskProfilingStepCompleted =
        isUsernameTypeExists &&
        user?.profile?.meta?.onboarding_steps?.risk_profiling?.status ===
          'completed';

      // 4. All Onboarding Steps completed

      const isOnboardingStepsCompleted =
        isUsernameTypeExists &&
        isOnboardingCASApplyStateCompleted &&
        (isInvestmentBehaviorStepCompleted ||
          isInvestmentBehaviorStepSkipped) &&
        isRiskProfilingStepCompleted;

      if (!user?.profile?.meta?.onboarding_steps) {
        navigation.replace('Auth', {screen: 'PermissionsWelcomeScreen'});
      } else if (isOnboardingStepsCompleted) {
        navigation.replace('Protected');
      } else if (
        isUsernameTypeExists &&
        isOnboardingCASApplyStateCompleted &&
        (isInvestmentBehaviorStepCompleted || isInvestmentBehaviorStepSkipped)
      ) {
        navigation.replace('Auth', {screen: 'EnterDobScreen'});
      } else if (
        isUsernameTypeExists &&
        !user?.profile?.meta?.onboarding_steps?.investment_behavior?.status
      ) {
        if (isCASRequestHasStatement) {
          if (isRiskProfilingStepCompleted) {
            navigation.replace('Protected');
          } else {
            navigation.replace('Auth', {screen: 'EnterDobScreen'});
          }
        } else {
          navigation.replace('Auth', {screen: 'PermissionsEmailSentScreen'});
        }
      } else if (isUsernameTypeExists && !isOnboardingCASApplyStateCompleted) {
        navigation.replace('Auth', {screen: 'PermissionsWelcomeScreen'});
      } else if (
        !user?.profile?.meta?.onboarding_steps ||
        Object.keys(user?.profile?.meta?.onboarding_steps)?.length === 0
      ) {
        navigation.replace('Auth', {screen: 'PermissionsWelcomeScreen'});
      } else {
        navigation.replace('Auth', {screen: 'PermissionsWelcomeScreen'});
      }
    }
  };
  return {handleRedirection, handleUpdateOnboardingStep};
};

export default useOnboardingHandleRedirection;
