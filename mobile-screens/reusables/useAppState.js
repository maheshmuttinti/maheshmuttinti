import {useEffect, useState, useRef} from 'react';
import {AppState} from 'react-native';

export default function useAppState() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      'change',
      nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('App has come to the foreground!');
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log('AppState', appState.current);
      },
    );

    return () => {
      appStateSubscription.remove();
    };
  }, []);

  return {appStateVisible};
}
