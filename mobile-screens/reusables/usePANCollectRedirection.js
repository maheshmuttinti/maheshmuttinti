import AsyncStorage from '@react-native-async-storage/async-storage';
import {linkPAN} from 'services';

export const usePANCollectRedirection = (
  form,
  name,
  navigation,
  waitForResponse,
) => {
  console.log('usePANCollectRedirection->waitForResponse: ', waitForResponse);
  const handleRedirection = async () => {
    try {
      let tokenFromStorage = await AsyncStorage.getItem('@access_token');

      if (tokenFromStorage !== null) {
        const payload = {
          pan: form?.value?.pan?.toUpperCase(),
          name,
        };
        const response = await linkPAN(payload);
        if (response?.pan && response?.name) {
          navigation.replace('FetchCAS', {
            screen: 'FetchCASFromRTAs',
            params: {
              refreshableCASDataProvidersForNBFC: ['cams', 'karvy'],
              waitForResponse: waitForResponse,
              flowFromOnboarding: true,
            },
          });
        }
      }
    } catch (error) {
      form.setErrors(error);
      throw error;
    }
  };
  return handleRedirection;
};
