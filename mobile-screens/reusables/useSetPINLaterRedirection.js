import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUser, updateUserProfile} from 'services';

export const useSetPINLaterRedirection = navigation => {
  const handleRedirection = async () => {
    try {
      let tokenFromStorage = await AsyncStorage.getItem('@access_token');

      if (tokenFromStorage !== null) {
        const user = await getUser();
        const meta = {
          meta: {
            ...user?.profile?.meta,
            mpin_set: 'skip',
          },
        };
        const updateProfilePayload = {
          ...meta,
        };

        await updateUserProfile(updateProfilePayload);

        navigation.replace('Protected');
      }
    } catch (error) {
      console.log(
        'error while redirection after set pin later button clicked',
        error,
      );
      return error;
    }
  };
  return handleRedirection;
};
