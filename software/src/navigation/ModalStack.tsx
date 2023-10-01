import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FareChart from '../components/modules/FareChart';

const Stack = createNativeStackNavigator();

const ModalStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="CustomModule" component={FareChart} />
    </Stack.Navigator>
  );
};

export default ModalStack;
