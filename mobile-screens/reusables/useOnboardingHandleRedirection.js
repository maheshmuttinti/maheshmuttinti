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
          console.log('if->isPANLinked: ', isPANLinked);
          resetPINSetup();
          navigation.replace('Protected');
        } else {
          console.log('else->isPANLinked: ', isPANLinked);
          resetPINSetup();
          navigation.replace('PANSetup');
        }
      }
    } catch (err) {
      console.log('error: ', err);
      if (err?.error === 'PAN not linked') {
        console.log('err?.error-->pan is not linked', err?.error);
        navigation.replace('PANSetup');
      } else {
        console.log('err?.error--> other error', err?.error);
        navigation.replace('PANSetup');
      }
      return err;
    }
  };
  return {handleRedirection, handleUpdateOnboardingStep};
};

export default useOnboardingHandleRedirection;
