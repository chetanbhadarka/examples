import 'react-native-gesture-handler';
/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';

import App from './src/App';
import {name as appName} from './app.json';
import {store} from './src/redux/store';
import LoaderComponent from './src/components/LoaderComponent';

let persistor = persistStore(store);

const ReduxApp = () => (
  <Provider store={store}>
    <PersistGate loading={<LoaderComponent />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => ReduxApp);