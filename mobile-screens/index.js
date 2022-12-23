/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useEffect, useState} from 'react';
import {LogBox, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {themes, ThemeProvider, useTheme} from 'theme';
import Config from 'react-native-config';
import {RootNavigation} from 'utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setTokens, setUser} from 'store';
import {getUser} from 'services';
import {useDispatch} from 'react-redux';
import {AnimatedEllipsis} from 'uin';
import Auth from './stacks/Auth';
import Protected from './stacks/Protected';
import EmptyStates from './stacks/EmptyStates';
import NetInfo from '@react-native-community/netinfo';
import {setNetworkStatus} from 'store';
import 'react-native-gesture-handler';
import {useSelector, shallowEqual} from 'react-redux';
import * as Sentry from '@sentry/react-native';
import PANSetup from './stacks/PANSetup';
import PINSetup from './stacks/PINSetup';
import AppPromo from './screens/AppPromo';
import {useClearAsyncStorageKeys} from './reusables/useClearAsyncStorageKeys';
import General from './stacks/General';
import {linking} from './deepLinkConfigs';
import withAuth from './hocs/withAuth';
import FetchCAS from './stacks/FetchCAS';

Sentry.init({
  dsn: Config.SENTRY_DSN,
});

const Stack = createStackNavigator();

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'EventEmitter.removeListener',
  'ViewPropTypes will be removed from React Native',
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  'Please report: Excessive number of pending callbacks: 501. Some pending callbacks that might have leaked by never being called from native code',
  'Task orphaned for request',
]);

const App = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(null);
  const {clearStoreForLogout} = useClearAsyncStorageKeys();
  const handleExpiredSession = React.useRef(() => {});

  const init = React.useCallback(async () => {
    try {
      setLoading(true);
      let tokenFromStorage = await AsyncStorage.getItem('@access_token');

      if (tokenFromStorage !== null) {
        dispatch(setTokens(JSON.parse(tokenFromStorage)));
        let userProfile = await getUser();
        if (userProfile) {
          dispatch(setUser(userProfile));
          setLoading(false);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      handleExpiredSession.current();
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
  }, [init, dispatch]);

  const {accessToken} = useSelector(
    ({auth}) => ({
      accessToken: auth.accessToken,
    }),
    shallowEqual,
  );

  const {isUserLoggedInWithMPIN} = useSelector(
    ({auth}) => ({
      isUserLoggedInWithMPIN: auth.isUserLoggedInWithMPIN,
    }),
    shallowEqual,
  );
  const {isSessionExpired} = useSelector(
    ({auth}) => ({
      isSessionExpired: auth.isSessionExpired,
    }),
    shallowEqual,
  );

  handleExpiredSession.current = async () => {
    if (isSessionExpired === true) {
      await clearStoreForLogout();
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <ThemeProvider theme={themes[theme]}>
        <NavigationContainer
          linking={linking}
          ref={RootNavigation.navigationRef}>
          <Stack.Navigator>
            <Stack.Screen
              name="General"
              options={{
                headerShown: false,
              }}
              component={General}
            />
            <Stack.Screen
              name="AppPromo"
              options={{
                headerShown: false,
              }}
              component={AppPromo}
            />
            {(accessToken === null ||
              accessToken === undefined ||
              Boolean(accessToken) === false ||
              isUserLoggedInWithMPIN === false ||
              isUserLoggedInWithMPIN === undefined ||
              isUserLoggedInWithMPIN === null) && (
              <Stack.Screen
                name="Auth"
                options={{
                  headerShown: false,
                }}
                component={Auth}
              />
            )}
            {(accessToken !== null || isUserLoggedInWithMPIN === true) && (
              <Stack.Screen
                name="Protected"
                options={{
                  headerShown: false,
                }}
                component={withAuth(Protected)}
              />
            )}
            <Stack.Screen
              name="PINSetup"
              options={{
                headerShown: false,
              }}
              component={PINSetup}
            />
            <Stack.Screen
              name="PANSetup"
              options={{
                headerShown: false,
              }}
              component={PANSetup}
            />
            <Stack.Screen
              name="FetchCAS"
              options={{
                headerShown: false,
              }}
              component={FetchCAS}
            />
            <Stack.Screen
              name="EmptyStates"
              options={{
                headerShown: false,
              }}
              component={EmptyStates}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </>
  );
};

const Loader = () => {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
      <AnimatedEllipsis dotSize={12} dotColor={theme.colors.primaryBlue} />
    </View>
  );
};

export default Sentry.wrap(App);
