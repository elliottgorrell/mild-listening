import React from "react";
import RootNavigation from "./navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CurrentUserContext } from "./context";
import { useAuthentication } from "./utils/hooks/useAuthentication";
import { registerRootComponent } from "expo";

function App(): React.JSX.Element {
  const { user, setUser } = useAuthentication();
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
