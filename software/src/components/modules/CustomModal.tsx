import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext} from 'react';
import {colors} from '../../style/colors';
import {ThemeContext} from '../../context/ThemeContext';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {fonts} from '../../style/fonts';
import {useNavigation} from '@react-navigation/native';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const FareChart = () => {
  const navigaton = useNavigation();
  const {darkMode} = useContext(ThemeContext);

  const isDarkMode = darkMode;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.DARK : colors.LIGHT,
  };

  const textStyle = {
    color: isDarkMode ? colors.LIGHT_ALT : colors.DARK,
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <View
        style={[
          styles.moduleContainer,
          {
            backgroundColor: isDarkMode
              ? colors.DARK_SHADE
              : colors.LIGHT_SHADE,
          },
        ]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.back}
            onPress={() => navigaton.goBack()}>
            <IonIcons
              name="chevron-back"
              size={28}
              color={colors.LIGHT_HIGHLIGHTED}
            />
          </TouchableOpacity>
          <Text style={[styles.moduleTitle, textStyle]}>Fare Chart</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT + 80,
  },
  moduleContainer: {
    height: '105%',
    width: '100%',
    position: 'absolute',
    top: '6%',
    borderRadius: 20,
    zIndex: 5000,
    elevation: 10,
    shadowColor: colors.DARK,
    alignItems: 'center',
  },
  header: {
    margin: 25,
    width: '90%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  moduleTitle: {
    fontFamily: fonts.Bree,
    fontSize: 18,
    flex: 0.9,
    textAlign: 'center',
    zIndex: 20,
  },
  back: {
    zIndex: 50,
  },
});

export default FareChart;
