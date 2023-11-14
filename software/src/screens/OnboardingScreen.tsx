/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { colors } from '../style/colors';
import { fonts } from '../style/fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthStack';
import { REG_URL } from '@env';
import OnboardingSvg from '../components/SvgComponents/OnboardingSvg';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const OnboardingScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { darkMode, toggleOffDarkMode } = useContext(ThemeContext);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const isDarkMode = darkMode;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.DARK : colors.LIGHT,
  };
  const backgroundStyleAlt = {
    backgroundColor: !isDarkMode ? colors.DARK : colors.LIGHT,
  };
  const textStyle = {
    color: isDarkMode ? colors.LIGHT_ALT : colors.DARK,
  };

  const textStyleAlt = {
    color: !isDarkMode ? colors.LIGHT_ALT : colors.DARK,
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err =>
      console.error('Error opening link: ', err),
    );
  };

  const regUrl = REG_URL;

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.TRANPARENT}
        translucent={true}
      />
      <View style={styles.screenContainer}>
        <View style={styles.onBoardImg}>
          <OnboardingSvg />
        </View>
        <View style={styles.onBoardIntro}>
          <View style={styles.gap10}>
            <Text style={[styles.onBoardTitle, textStyle]}>Metro Rider</Text>
            <Text style={[styles.onBoardInfo, textStyle]}>
              For your convenient and easy trip experience, Login to our service
              here:
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <View style={[styles.buttons, backgroundStyleAlt]}>
              <AntDesign
                name={'login'}
                size={22}
                color={colors.LIGHT_HIGHLIGHTED}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.btnPadding}>
                <Text style={[styles.buttonTitle, textStyleAlt]}>Login</Text>
              </TouchableOpacity>
              <FontAwesome6Icon
                name="angle-right"
                size={22}
                color={colors.LIGHT_HIGHLIGHTED}
                style={styles.arrow}
              />
            </View>
            <View style={[styles.buttons]}>
              <IonIcons
                name="open-outline"
                size={24}
                color={colors.LIGHT_HIGHLIGHTED}
              />
              <TouchableOpacity
                onPress={() => openLink(regUrl)}
                style={styles.btnPadding}>
                <Text style={[styles.buttonTitle, textStyle]}>
                  Apply For Registration
                </Text>
              </TouchableOpacity>
              <FontAwesome6Icon
                name="angle-right"
                size={22}
                color={colors.LIGHT_HIGHLIGHTED}
                style={styles.arrow}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flexDirection: 'column',
    height: Dimensions.get('window').height + 80,
    width: Dimensions.get('window').width,
    paddingVertical: 50,
    marginBottom: 100,
    justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  onBoardImg: {
    flex: 1,
    paddingHorizontal: 30,
    marginBottom: -30,
  },
  onBoardIntro: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 30,
  },
  onBoardInfo: {
    fontSize: 14,
    fontFamily: fonts.Vollkorn,
    opacity: 0.8,
  },
  onBoardTitle: {
    fontSize: 36,
    marginVertical: 15,
    fontFamily: fonts.Bree,
  },
  gap10: {
    gap: 15,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 30,
    gap: 10,
  },
  buttons: {
    position: 'relative',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    // backgroundColor: colors.DARK_SHADE,
    borderColor: colors.LIGHT_HIGHLIGHTED,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 30,
    alignItems: 'center',
  },
  buttonTitle: {
    fontFamily: fonts.KarmaSemiBold,
    fontSize: 18,
    textAlign: 'center',
  },
  btnPadding: { alignItems: 'center', paddingTop: 5 },
  arrow: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default OnboardingScreen;
