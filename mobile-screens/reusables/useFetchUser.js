import * as React from 'react';
import {useState} from 'react';
import {getUser} from 'services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {prettifyJSON} from 'utils';

const useFetchUser = () => {
  const [user, setUser] = useState(null);
  const [emailMobileExists, setEmailMobileExists] = useState({
    status: false,
    data: {email: null, mobileNumber: null},
  });
  const navigation = useNavigation();

  React.useEffect(() => {
    (async () => {
      try {
        let tokenFromStorage = await AsyncStorage.getItem('@access_token');

        if (tokenFromStorage !== null) {
          let userProfile = await getUser();

          if (userProfile) {
            console.log('userProfile: ', prettifyJSON(userProfile));
            setUser(userProfile);
            const isEmailMobileNumberExists =
              (userProfile?.attributes
                ?.map(item => item.type)
                .includes('email') ||
                userProfile?.profile?.meta?.email) &&
              userProfile?.attributes
                ?.map(item => item.type)
                .includes('mobile_number');
            console.log(
              'isEmailMobileNumberExists: ',
              isEmailMobileNumberExists,
            );
            if (isEmailMobileNumberExists) {
              const email =
                userProfile?.attributes?.find(item => item.type === 'email')
                  ?.value || userProfile?.profile?.meta?.email;
              console.log('email: ', email);
              const mobileNumber = userProfile?.attributes?.find(
                item => item.type === 'mobile_number',
              )?.value;
              console.log('mobileNumber: ', mobileNumber);

              setEmailMobileExists({
                status: isEmailMobileNumberExists,
                email,
                mobileNumber,
              });
            }
          }
        } else {
          navigation.replace('Auth', {screen: 'SigninHome'});
        }
      } catch (error) {
        console.log('useFetchUser hook api call error');
        return error;
      }
    })();
  }, []);

  return {user, emailMobileExists};
};

export default useFetchUser;
