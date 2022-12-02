/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './mobile-screens';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {mobileStore} from 'store';
import React from 'react';

const MobileApp = () => {
  return (
    <Provider store={mobileStore}>
      <App />
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => MobileApp);
