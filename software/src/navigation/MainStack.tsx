import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import VerifyScreen from '../screens/VerifyScreen';
import AppStack from './AppStack';
import ModalStack from './ModalStack';
import AuthStack from './AuthStack';
import {StatusBar, StyleSheet} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import {colors} from '../style/colors';
import {Dimensions} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import FareChart from '../components/modules/FareChart';
import HowTosScreen from '../components/modules/HowTosScreen';
import TermsScreen from '../components/modules/TermScreen';

export type MainStackParamList = {
  AuthStack: undefined;
  Verify: undefined;
  AppStack: undefined;
  FareChart: undefined;
  HowTos: undefined;
  Terms: undefined;
};

type RouteProps = {
  initialRouteName: keyof MainStackParamList | undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = ({initialRouteName}: RouteProps) => {
  const {darkMode} = useContext(ThemeContext);
  const isDarkMode = darkMode;
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.DARK : colors.LIGHT,
  };
  return (
    <SafeAreaProvider style={[backgroundStyle, styles.screenContainer]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.TRANPARENT}
        translucent={true}
      />
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={initialRouteName}>
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="Verify" component={VerifyScreen} />
        <Stack.Screen name="AppStack" component={AppStack} />
        <Stack.Screen name="FareChart" component={FareChart} />
        <Stack.Screen name="HowTos" component={HowTosScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
});

export default MainStack;
