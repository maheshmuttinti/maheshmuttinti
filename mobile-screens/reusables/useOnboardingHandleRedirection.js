import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {updateUserProfile, getLinkedPAN} from 'services';
import {useResetStack} from './useResetStack';

const useOnboardingHandleRedirection = () => {
  const navigation = useNavigation();
  const resetPINSetup = useResetStack('PINSetup');
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

  const handleRedirection = async () => {
    try {
      let tokenFromStorage = await AsyncStorage.getItem('@access_token');

      if (tokenFromStorage !== null) {
        const panResponse = await getLinkedPAN();

        const isPANLinked = panResponse?.pan && panResponse?.name;

        if (isPANLinked) {
          resetPINSetup();

          navigation.replace('Protected');
        } else {
          resetPINSetup();
          navigation.replace('PANSetup');
        }
      }
    } catch (err) {
      if (err?.error === 'PAN not linked') {
        navigation.replace('PANSetup');
      } else {
        navigation.replace('PANSetup');
      }
      throw err;
    }
  };
  return {handleRedirection, handleUpdateOnboardingStep};
};

export default useOnboardingHandleRedirection;
