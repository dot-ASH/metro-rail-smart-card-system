import React, {useEffect, useState} from 'react';
import {AuthProvider} from './src/context/AuthContext';
import {NavigationContainer} from '@react-navigation/native';
import Splash from './src/components/Splash';
import {ThemeProvider} from './src/context/ThemeContext';
import MainStack from './src/navigation/MainStack';
import supabase from './src/data/supaBaseClient';
import NetInfo from '@react-native-community/netinfo';

function App(): JSX.Element {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [hasSession, setHasSession] = useState<boolean | undefined>();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const {data} = await supabase.auth.getSession();
      setHasSession(!!data?.session);
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  });

  console.log('hmm', typeof hasSession === 'undefined', hasSession);

  const [isAppReady, setAppReady] = useState(false);
  return !isAppReady && typeof hasSession === 'undefined' ? (
    // Add hasSession to the parameter for loading while checking session activity
    <Splash
      isReady={true}
      connectivity={isConnected}
      onAnimationFinish={() => setAppReady(true)}
    />
  ) : (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <MainStack initialRouteName={hasSession ? 'Verify' : 'AuthStack'} />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
