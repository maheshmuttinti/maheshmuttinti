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
import NetInfo from '@react-native-community/netinfo';
import {setNetworkStatus} from 'store';
import 'react-native-gesture-handler';
import {useSelector, shallowEqual} from 'react-redux';
import * as Sentry from '@sentry/react-native';
import ScreenDeterminer from './screens/Auth/ScreenDeterminer';
import EmailActivationLinkScreen from './screens/VerifyEmailLink';
import PANSetup from './stacks/PANSetup';
import PINSetup from './stacks/PINSetup';
import AppPromo from './screens/AppPromo';

Sentry.init({
  dsn: Config.SENTRY_DSN,
});

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

  const {isUserLoggedInWithMPIN} = useSelector(
    ({auth}) => ({
      isUserLoggedInWithMPIN: auth.isUserLoggedInWithMPIN,
    }),
    shallowEqual,
  );

  const {accessToken} = useSelector(
    ({auth}) => ({
      accessToken: auth.accessToken,
    }),
    shallowEqual,
  );

  const init = React.useCallback(async () => {
    try {
      let tokenFromStorage = await AsyncStorage.getItem('@access_token');
      console.log('tokenFromStorage: ', tokenFromStorage);

      if (tokenFromStorage !== null) {
        dispatch(setTokens(JSON.parse(tokenFromStorage)));
        let userProfile = await getUser();
        if (userProfile) {
          dispatch(setUser(userProfile));
        }
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  }, [dispatch]);

  useEffect(() => {
    init();
    const unsubscribe = NetInfo.addEventListener(state => {
      dispatch(setNetworkStatus(state.isConnected ? 'online' : 'offline'));
    });
    return () => {
      unsubscribe();
    };
  }, []);

  console.log('accessToken in stack index: ', Boolean(accessToken) === false);
  console.log('isUserLoggedInWithMPIN: ', isUserLoggedInWithMPIN);

  return (
    <>
      <ThemeProvider theme={themes[theme]}>
        <NavigationContainer
          linking={linking}
          ref={RootNavigation.navigationRef}>
          <Stack.Navigator>
            <Stack.Screen
              name="ScreenDeterminer"
              options={{headerShown: false}}
              component={ScreenDeterminer}
            />

            {(accessToken === null ||
              accessToken === undefined ||
              Boolean(accessToken) === false ||
              isUserLoggedInWithMPIN === false ||
              isUserLoggedInWithMPIN === undefined ||
              isUserLoggedInWithMPIN === null) && (
              <Stack.Screen
                name="Auth"
                options={{headerShown: false}}
                component={Auth}
              />
            )}
            {(accessToken !== null || isUserLoggedInWithMPIN === true) && (
              <Stack.Screen
                name="Protected"
                options={{headerShown: false}}
                component={Protected}
              />
            )}
            <Stack.Screen
              name="AppPromo"
              options={{headerShown: false}}
              component={AppPromo}
            />
            <Stack.Screen
              name="VerifyEmail"
              options={{headerShown: false}}
              component={EmailActivationLinkScreen}
            />
            <Stack.Screen
              name="PINSetup"
              options={{headerShown: false}}
              component={PINSetup}
            />
            <Stack.Screen
              name="PANSetup"
              options={{headerShown: false}}
              component={PANSetup}
            />
            <Stack.Screen
              name="EmptyStates"
              options={{headerShown: false}}
              component={EmptyStates}
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

export default Sentry.wrap(App);
