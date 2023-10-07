import React, {useEffect, useState} from 'react';
import {AuthProvider} from './src/context/AuthContext';
import {NavigationContainer} from '@react-navigation/native';
import Splash from './src/components/Splash';
import {ThemeProvider} from './src/context/ThemeContext';
import MainStack from './src/navigation/MainStack';
import supabase from './src/data/supaBaseClient';

function App(): JSX.Element {
  const checkAuth = async () => {
    // const {data, error} = await supabase.auth.getSession();
    // !error ? console.log(data) : console.log(error.toString());
    const {data, error} = await supabase.auth.refreshSession({
      refresh_token: 'Uh2LKyXVHbbQMyLkwZf2KQ',
    });
    const {session, user} = data;
    !error ? console.log(session, user) : console.log(error.toString());
  };
  useEffect(() => {
    checkAuth();
  });
  const [isAppReady, setAppReady] = useState(false);
  return !isAppReady ? (
    <Splash isReady={true} onAnimationFinish={() => setAppReady(true)} />
  ) : (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <MainStack initialRouteName="AuthStack" />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
