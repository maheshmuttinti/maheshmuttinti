import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUser, updateUserProfile} from 'services';
import {setIsUserLoggedInWithMPIN} from 'store';
import {useDispatch} from 'react-redux';
import useOnboardingHandleRedirection from './useOnboardingHandleRedirection';

export const useSetPINLaterRedirection = navigation => {
  const dispatch = useDispatch();
  const {handleRedirection: handleCheckPANLinkingAndRedirect} =
    useOnboardingHandleRedirection();
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
        dispatch(setIsUserLoggedInWithMPIN(true));
        await handleCheckPANLinkingAndRedirect();
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
