import React from 'react';
import RootNavigation from './navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CurrentUserProvider } from './context';
import { registerRootComponent } from 'expo';

function App(): React.JSX.Element {
  return (
    <>
      <CurrentUserProvider>
        <SafeAreaProvider>
          <RootNavigation />
        </SafeAreaProvider>
      </CurrentUserProvider>
    </>
  );
}

registerRootComponent(App);
