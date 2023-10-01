import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import TabBar from '../components/tabBar';
import Profile from '../screens/Profile';
import {TabBarProps} from '../components/tabBar';
import TopStack from './TopStack';

export type AppStackParamList = {
  Home: undefined;
  History: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppStackParamList>();

function AppStack() {
  const tabBarComponent = React.useCallback(
    (props: TabBarProps) => <TabBar {...props} />,
    [],
  );
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={tabBarComponent}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="History" component={TopStack} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
export default AppStack;
