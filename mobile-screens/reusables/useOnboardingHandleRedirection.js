import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {getUser, updateUserProfile} from 'services';
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

  const handleRedirection = async latestUser => {
    let tokenFromStorage = await AsyncStorage.getItem('@access_token');

    if (tokenFromStorage !== null) {
      const user = latestUser || (await getUser());

      const isPANExists = !!user?.profile?.meta?.pan;

      if (isPANExists) {
        console.log('if->isPANExists: ', isPANExists);
        resetPINSetup();
        navigation.replace('Protected');
      } else {
        console.log('else->isPANExists: ', isPANExists);
        resetPINSetup();
        navigation.replace('PANSetup');
      }
    }
  };
  return {handleRedirection, handleUpdateOnboardingStep};
};

export default useOnboardingHandleRedirection;
