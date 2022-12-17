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
import {StepperProvider} from 'uin';

const MobileApp = () => {
  return (
    <Sentry.TouchEventBoundary>
      <Provider store={mobileStore}>
        <StepperProvider>
          <App />
        </StepperProvider>
      </Provider>
    </Sentry.TouchEventBoundary>
  );
};

AppRegistry.registerComponent(appName, () => MobileApp);
