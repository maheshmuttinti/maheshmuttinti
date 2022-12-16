import AsyncStorage from '@react-native-async-storage/async-storage';
import {linkPAN} from 'services';

export const usePANCollectRedirection = (pan, name, form, navigation) => {
  console.log('pan, name', pan, name);
  const handleRedirection = async () => {
    try {
      console.log('usePANCollectRedirection->handleRedirection called: ', pan);
      let tokenFromStorage = await AsyncStorage.getItem('@access_token');

      if (tokenFromStorage !== null) {
        const payload = {
          pan: pan?.toUpperCase(),
          name,
        };
        console.log('payload: ', payload);
        const response = await linkPAN(payload);
        if (response?.pan && response?.name) {
          console.log('response: ', response);
          navigation.replace('Protected');
        }
      }
    } catch (error) {
      console.log(
        'error while redirection after set pin later button clicked',
        error,
      );
      form.setErrors(error);
      return error;
    }
  };
  return handleRedirection;
};
