import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import {TabBarProps} from '../components/tabBar';
import TranHistory from '../screens/TranHistory';
import TripHistory from '../screens/TripHistory';
import CustomTopBar from '../components/CustomTopBar';
import {TopBarProps} from '../components/CustomTopBar';

export type TopStackParamList = {
  Transactions: undefined;
  Trips: undefined;
};

const Tab = createMaterialTopTabNavigator<TopStackParamList>();

function TopStack() {
  const tabBarComponent = React.useCallback(
    (props: TopBarProps) => <CustomTopBar {...props} />,
    [],
  );
  return (
    <Tab.Navigator tabBar={tabBarComponent}>
      <Tab.Screen name="Transactions" component={TranHistory} />
      <Tab.Screen name="Trips" component={TripHistory} />
    </Tab.Navigator>
  );
}
export default TopStack;
