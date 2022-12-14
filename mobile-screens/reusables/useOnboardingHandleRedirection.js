import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {getUser, updateUserProfile} from 'services';
import {useResetAuthStack} from './useResetAuthStack';

const useOnboardingHandleRedirection = () => {
  const navigation = useNavigation();
  const {resetAuthStack} = useResetAuthStack();

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

      const isPANExists = !!user?.profile?.meta?.pan;

      const isPANSetupCompleted = isUsernameTypeExists && isPANExists;

      if (isPANSetupCompleted) {
        console.log('if->isPANSetupCompleted: ', isPANSetupCompleted);
        navigation.replace('Protected');
      } else {
        console.log('else->isPANSetupCompleted: ', isPANSetupCompleted);
        navigation.replace('PANSetup');
      }
    }
  };
  return {handleRedirection, handleUpdateOnboardingStep};
};

export default useOnboardingHandleRedirection;
