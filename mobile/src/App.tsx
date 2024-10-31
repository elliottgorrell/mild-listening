import React, { useState } from 'react';
import RootNavigation from './navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CurrentUserContext } from './context';
import { registerRootComponent } from 'expo';
import { LoggedOutUser } from './types/user';

function App(): React.JSX.Element {
  const [user, setUser] = useState(LoggedOutUser);
  return (
    <>
      <CurrentUserContext.Provider value={{ user, setUser }}>
        <SafeAreaProvider>
          <RootNavigation />
        </SafeAreaProvider>
      </CurrentUserContext.Provider>
    </>
  );
}

registerRootComponent(App);
