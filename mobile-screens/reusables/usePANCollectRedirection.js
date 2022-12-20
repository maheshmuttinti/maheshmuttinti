import AsyncStorage from '@react-native-async-storage/async-storage';
import {linkPAN} from 'services';

export const usePANCollectRedirection = (pan, name, form, navigation) => {
  const handleRedirection = async () => {
    try {
      let tokenFromStorage = await AsyncStorage.getItem('@access_token');

      if (tokenFromStorage !== null) {
        const payload = {
          pan: pan?.toUpperCase(),
          name,
        };
        const response = await linkPAN(payload);
        if (response?.pan && response?.name) {
          navigation.replace('FetchCAS', {screen: 'FetchCASFromRTAs'});
        }
      }
    } catch (error) {
      form.setErrors(error);
      return error;
    }
  };
  return handleRedirection;
};
