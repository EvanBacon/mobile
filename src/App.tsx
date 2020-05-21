/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import React, {useMemo, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {I18nContext, I18nManager} from '@shopify/react-i18n';
import {ThemeProvider} from '@shopify/restyle';
import MainNavigator from 'navigation/MainNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StorageServiceProvider, useStorage} from 'services/StorageService';
import theme from 'shared/theme';
import Reactotron from 'reactotron-react-native';
import {NativeModules, StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {TestMode} from 'testMode';
import {TEST_MODE, APP_ID, SUBMIT_URL, RETRIEVE_URL, HMAC_KEY} from 'env';
import {ExposureNotificationServiceProvider} from 'services/ExposureNotificationService';
import {BackendService} from 'services/BackendService';
import {SharedTranslations} from 'locale';

// grabs the ip address
if (__DEV__) {
  const host = NativeModules.SourceCode.scriptURL.split('://')[1].split(':')[0];
  Reactotron.configure({host})
    .useReactNative()
    .connect();
}

const App = () => {
  useEffect(() => SplashScreen.hide(), []);

  const {locale} = useStorage();
  const i18nManager = useMemo(
    () =>
      new I18nManager({
        locale,
        onError(error) {
          console.log(error.message);
        },
      }),
    [locale],
  );

  console.log(TEST_MODE, APP_ID, SUBMIT_URL, RETRIEVE_URL, HMAC_KEY);

  const backendService = useMemo(() => new BackendService(RETRIEVE_URL, SUBMIT_URL, HMAC_KEY), []);

  return (
    <I18nContext.Provider value={i18nManager}>
      <SharedTranslations>
        <ExposureNotificationServiceProvider backendInterface={backendService}>
          <NavigationContainer>
            {TEST_MODE ? (
              <TestMode>
                <MainNavigator />
              </TestMode>
            ) : (
              <MainNavigator />
            )}
          </NavigationContainer>
        </ExposureNotificationServiceProvider>
      </SharedTranslations>
    </I18nContext.Provider>
  );
};

const AppProvider = () => {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="transparent" translucent />
      <ThemeProvider theme={theme}>
        <StorageServiceProvider>
          <App />
        </StorageServiceProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default AppProvider;
