import React, {useState} from 'react';
import {AuthProvider} from './src/context/AuthContext';
import {NavigationContainer} from '@react-navigation/native';
import Splash from './src/components/Splash';
import {ThemeProvider} from './src/context/ThemeContext';
import MainStack from './src/navigation/MainStack';

function App(): JSX.Element {
  const [isAppReady, setAppReady] = useState(false);
  return !isAppReady ? (
    <Splash isReady={true} onAnimationFinish={() => setAppReady(true)} />
  ) : (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <MainStack initialRouteName="AppStack" />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
