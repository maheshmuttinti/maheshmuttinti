/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './mobile-screens';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {mobileStore} from 'store';
import React from 'react';
import * as Sentry from '@sentry/react-native';

const MobileApp = () => {
  return (
    <Sentry.TouchEventBoundary>
      <Provider store={mobileStore}>
        <App />
      </Provider>
    </Sentry.TouchEventBoundary>
  );
};

AppRegistry.registerComponent(appName, () => MobileApp);
