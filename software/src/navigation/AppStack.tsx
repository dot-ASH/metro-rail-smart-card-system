/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import TabBar from '../components/tabBar';
import Profile from '../screens/Profile';
import {TabBarProps} from '../components/tabBar';
import TopStack from './TopStack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Dimensions, StyleSheet, View} from 'react-native';
import Payment from '../components/Payment';
import {ThemeContext} from '../context/ThemeContext';

export type AppStackParamList = {
  Home: undefined;
  History: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppStackParamList>();

function AppStack() {
  const [showPayment, setShowPayment] = useState(false);
  const [elavatedBg, setElavatedBg] = useState(false);
  const {payMode, togglePayMode} = useContext(ThemeContext);
  const tabBarComponent = React.useCallback(
    (props: TabBarProps) => <TabBar {...props} />,
    [],
  );

  const isPayMode = payMode;

  useEffect(() => {
    if (isPayMode) {
      setElavatedBg(true);
      setShowPayment(true);
    } else {
      setElavatedBg(false);
      setShowPayment(false);
    }
  }, [isPayMode]);

  return (
    <SafeAreaProvider style={{position: 'relative'}}>
      {elavatedBg ? <View style={styles.elavatedbg} /> : null}
      {showPayment ? (
        <Payment
          onCancle={() => {
            togglePayMode();
            setShowPayment(false);
            setElavatedBg(false);
          }}
        />
      ) : null}
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={tabBarComponent}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="History" component={TopStack} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
}
export default AppStack;

const styles = StyleSheet.create({
  elavatedbg: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: Dimensions.get('window').height + 80,
    width: Dimensions.get('window').width,
    zIndex: 2000,
  },
});
