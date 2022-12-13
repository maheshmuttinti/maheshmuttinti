import * as React from 'react';
import {useState} from 'react';
import {getUser} from 'services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const useUser = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  React.useEffect(() => {
    (async () => {
      try {
        let tokenFromStorage = await AsyncStorage.getItem('@access_token');

        if (tokenFromStorage !== null) {
          let userProfile = await getUser();

          if (userProfile) {
            setUser(userProfile);
          }
        } else {
          navigation.replace('Auth', {screen: 'SigninHome'});
        }
      } catch (error) {
        console.log('useUser hook api call error');
        return error;
      }
    })();
  }, []);

  return user;
};

export default useUser;
