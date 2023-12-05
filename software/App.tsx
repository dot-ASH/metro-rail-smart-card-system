import React, { useEffect, useState } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import Splash from './src/components/Splash';
import { ThemeProvider } from './src/context/ThemeContext';
import MainStack from './src/navigation/MainStack';
import supabase from './src/data/supaBaseClient';
import NetInfo from '@react-native-community/netinfo';
import PushNotification, { Importance } from "react-native-push-notification";

import { PermissionsAndroid } from 'react-native';
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

PushNotification.configure({
  onRegister: function(token) {
    console.log("TOKEN:", token);
  },
  onNotification: function(notification) {
    console.log("NOTIFICATION:", notification);
  },
  onAction: function(notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);
  },

  onRegistrationError: function(err) {
    console.error(err.message, err);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

PushNotification.popInitialNotification((notification) => {
  console.log('Initial Notification', notification);
});


PushNotification.createChannel(
  {
    channelId: "123",
    channelName: "My channel",
    channelDescription: "A channel to categorise your notifications",
    soundName: "default",
    importance: Importance.HIGH,
    vibrate: true,
    playSound: true
  },
  (created) => console.log(`createChannel returned '${created}'`));


function App(): JSX.Element {
  const [isAppReady, setAppReady] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [hasSession, setHasSession] = useState<boolean | undefined>();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state?.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setHasSession(!!data?.session);
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  });

  return !isAppReady || typeof hasSession === 'undefined' ? (
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
