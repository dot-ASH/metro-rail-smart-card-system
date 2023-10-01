/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useContext} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import {colors} from '../style/colors';

function TripHistory(): JSX.Element {
  const {darkMode, toggleOffDarkMode} = useContext(ThemeContext);
  const isDarkMode = darkMode;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.DARK : colors.LIGHT,
  };
  const textStyle = {
    color: isDarkMode ? colors.LIGHT_ALT : colors.DARK,
  };

  const textStyleAlt = {
    color: !isDarkMode ? colors.LIGHT_ALT : colors.DARK,
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.screenContainer]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.TRANPARENT}
        translucent={true}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[backgroundStyle, styles.screenContainer]}>
        <Text style={{fontSize: 27, color: 'white'}}>
          doloribus quisquam. Nostrum voluptas ullam perferendis repellat
          adipisci! Amet, aliquid molestiae quidem quisquam perspiciatis
          expedita illo, repellat, autem minima ratione eum cupiditate dolorum
          obcaecati. Amet iste earum consectetur nostrum distinctio laudantium
          labore cum nobis obcaecati corporis dolorum esse perferendis animi
          iure nisi magnam, pariatur harum iusto? Accusantium eveniet deserunt
          corrupti possimus ullam excepturi molestiae animi. Adipisci quibusdam
          ab, veniam iure sit delectus! Tenetur, eveniet.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flexDirection: 'column',
    height: Dimensions.get('window').height + 80,
    width: Dimensions.get('window').width,
    marginBottom: 100,
  },
});
export default TripHistory;
