import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import VerifyScreen from '../screens/VerifyScreen';
import AppStack from './AppStack';
import ModalStack from './ModalStack';
import AuthStack from './AuthStack';

export type MainStackParamList = {
  AuthStack: undefined;
  Verify: undefined;
  AppStack: undefined;
  ModuleStack: undefined;
};

type RouteProps = {
  initialRouteName: keyof MainStackParamList | undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = ({initialRouteName}: RouteProps) => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={initialRouteName}>
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="Verify" component={VerifyScreen} />
      <Stack.Screen name="AppStack" component={AppStack} />
      <Stack.Screen name="ModuleStack" component={ModalStack} />
    </Stack.Navigator>
  );
};

export default MainStack;
