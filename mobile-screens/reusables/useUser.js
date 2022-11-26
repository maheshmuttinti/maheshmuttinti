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
        let hideIntro = JSON.parse(await AsyncStorage.getItem('@hide_intro'));

        if (tokenFromStorage !== null) {
          let userProfile = await getUser();

          if (userProfile) {
            setUser(userProfile);
          }
        } else {
          if (hideIntro === false || hideIntro === null) {
            navigation.replace('IntroScreen');
          } else {
            navigation.replace('Auth', {screen: 'SigninHome'});
          }
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
