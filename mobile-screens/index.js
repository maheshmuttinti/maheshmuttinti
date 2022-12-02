/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useEffect} from 'react';
import {LogBox, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {themes, ThemeProvider, useTheme} from 'theme';
import Config from 'react-native-config';
import {RootNavigation} from 'utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setTokens, setUser} from 'store';
import {getUser} from 'services';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-toast-message';
import {Card} from 'uin';
import {InfoIcon, WarningIcon1} from 'assets';
import Auth from './stacks/Auth';
import Protected from './stacks/Protected';
import EmptyStates from './stacks/EmptyStates';
import GraphsStack from './stacks/Graphs';
import NetInfo from '@react-native-community/netinfo';
import {setNetworkStatus} from 'store';
import 'react-native-gesture-handler';
import {useSelector, shallowEqual} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

const Stack = createStackNavigator();

console.log('Config.API_URL', Config.API_URL);

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'EventEmitter.removeListener',
  'ViewPropTypes will be removed from React Native',
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  'Please report: Excessive number of pending callbacks: 501. Some pending callbacks that might have leaked by never being called from native code',
  'Task orphaned for request',
]);

const config = {
  screens: {
    Auth: {
      screens: {
        SocialLoginRedirection: 'social-login-status',
        GmailAuthorizeStatus: 'gmail-authorize-status',
        CasEmailVerificationStatus: 'cas-email-verification-status',
      },
    },
    Protected: {
      screens: {
        LoanApplication: 'signzy/video',
        CAMSSuccess: 'cams/lien-marking',
      },
    },
  },
};

const linking = {
  prefixes: ['finezzy://'],
  config,
};

const App = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const toastConfig = {
    schemeWarning: () => <SchemeWarningComponent />,
    selectSchemeWarning: () => <SelectSchemeWarningComponent />,
  };

  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  // const {isUserLoggedInWithMPIN} = useSelector(
  //   ({auth}) => ({
  //     isUserLoggedInWithMPIN: auth.isUserLoggedInWithMPIN,
  //   }),
  //   shallowEqual,
  // );

  // const init = async () => {
  //   try {
  //     let tokenFromStorage = await AsyncStorage.getItem('@access_token');
  //     if (tokenFromStorage !== null) {
  //       dispatch(setTokens(JSON.parse(tokenFromStorage)));
  //       let userProfile = await getUser();
  //       if (userProfile) {
  //         dispatch(setUser(userProfile));
  //       }
  //     }
  //   } catch (error) {
  //     return error;
  //   }
  // };

  // useEffect(() => {
  //   init();
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     dispatch(setNetworkStatus(state.isConnected ? 'online' : 'offline'));
  //   });

  //   return () => unsubscribe();
  // }, []);

  return (
    <>
      <ThemeProvider theme={themes[theme]}>
        <NavigationContainer
          linking={linking}
          ref={RootNavigation.navigationRef}>
          <Stack.Navigator>
            {/* <Stack.Screen
              name="Auth"
              options={{headerShown: false}}
              component={Auth}
            />
            {isUserLoggedInWithMPIN === true && (
              <Stack.Screen
                name="Protected"
                options={{headerShown: false}}
                component={Protected}
              />
            )}
            <Stack.Screen
              name="EmptyStates"
              options={{headerShown: false}}
              component={EmptyStates}
            /> */}
            <Stack.Screen
              name="GraphsStack"
              options={{headerShown: false}}
              component={GraphsStack}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
      <Toast config={toastConfig} />
    </>
  );
};

function SchemeWarningComponent() {
  const theme = useTheme();
  return (
    <Card
      style={{
        backgroundColor: theme.colors.backgroundYellow,
        paddingLeft: 17.25,
        marginHorizontal: 17,
        marginTop: 30,
        marginBottom: 100,
        borderRadius: 8,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View>
        <InfoIcon fill={theme.colors.error} />
      </View>
      <Text
        style={{
          ...theme.fontSizes.small,
          fontWeight: theme.fontWeights.moreBold,
          color: theme.colors.text,
          fontFamily: theme.fonts.regular,
          paddingLeft: 17.25,
          marginRight: 52,
        }}>
        You have selected enough schemes to reach the desired loan amount
      </Text>
    </Card>
  );
}

function SelectSchemeWarningComponent() {
  const theme = useTheme();

  return (
    <Card
      style={{
        backgroundColor: theme.colors.backgroundYellow,
        paddingLeft: 17.25,
        marginHorizontal: 17,
        marginTop: 30,
        marginBottom: 100,
        borderRadius: 8,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View>
        <WarningIcon1 />
      </View>
      <Text
        style={{
          ...theme.fontSizes.small,
          fontWeight: theme.fontWeights.moreBold,
          color: theme.colors.text,
          fontFamily: theme.fonts.regular,
          paddingLeft: 17.25,
          marginRight: 52,
        }}>
        You cannot add more than 3 NBFC to compare
      </Text>
    </Card>
  );
}

export default App;
