/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useContext, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomDigitKeyboard from '../components/CustomDigitKeyboard';
import {colors} from '../style/colors';
import {ThemeContext} from '../context/ThemeContext';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {fonts} from '../style/fonts';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../navigation/MainStack';
import {compareSHA} from '../security/encryp';
import {useUserInfo} from '../context/AuthContext';
import CustomDialog from '../components/CustomDialog';
import CustomAlert from '../components/CustomAlert';

type homeScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'AppStack'
>;

interface homeScreenProp {
  navigation: homeScreenNavigationProp;
}

let letters: string[] = [];
function VerifyScreen({navigation}: homeScreenProp): JSX.Element {
  const {darkMode} = useContext(ThemeContext);
  const {user} = useUserInfo();
  const isDarkMode = darkMode;
  const [alert, setAlert] = useState<string | null>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.DARK : colors.LIGHT,
  };
  const textStyle = {
    color: isDarkMode ? colors.LIGHT_ALT : colors.DARK,
  };

  const textStyleAlt = {
    color: !isDarkMode ? colors.LIGHT_ALT : colors.DARK,
  };
  const [input, setInput] = useState('');

  const handleKeyPress = (key: string) => {
    if (input.length < 5) {
      setInput(prevInput => prevInput + key);
      letters.push(key);
    }
  };

  const setAlertText = (text: string) => {
    setAlert(text);
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  const verifyPin = async () => {
    console.log(input, user[0].phn_no[0].verify_pin);
    if (!input) {
      setAlertText('Enter your PIN');
      return;
    }

    const pinMatches = await compareSHA(input, user[0].phn_no[0].verify_pin);
    if (pinMatches) {
      navigation.navigate('AppStack');
    } else {
      setAlertText("PIN doesn't match");
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.TRANPARENT}
        translucent={true}
      />
      <CustomAlert isVisible={alert ? true : false} text={alert} />
      <View style={styles.screenContainer}>
        <View style={styles.verifyIntro}>
          <View style={styles.gap10}>
            <Text style={[styles.verifyTitle, textStyle]}>Verify</Text>
            <Text style={[styles.verifyInfo, textStyle]}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Consequuntur ipsa dicta officia illum obcaecati.
            </Text>
          </View>

          <View style={styles.flexCol}>
            <View style={styles.textBox}>
              <View style={styles.textInput}>
                <Text style={styles.input}>
                  {letters[0] ? letters[0] : ' '}
                </Text>
                <Text style={styles.input}>
                  {letters[1] ? letters[1] : ' '}
                </Text>
                <Text style={styles.input}>
                  {letters[2] ? letters[2] : ' '}
                </Text>
                <Text style={styles.input}>
                  {letters[3] ? letters[3] : ' '}
                </Text>
                <Text style={styles.input}>
                  {letters[4] ? letters[4] : ' '}
                </Text>
              </View>
              <TouchableOpacity onPress={() => verifyPin()}>
                <FontAwesome6Icon
                  name="arrow-right"
                  size={32}
                  color={colors.LIGHT_HIGHLIGHTED}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity>
              <Text style={[styles.forget, textStyle]}>forget PIN?</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.keypad,
            {backgroundColor: isDarkMode ? colors.LIGHT : colors.DARK},
          ]}>
          <View style={styles.line} />
          <CustomDigitKeyboard
            onKeyPress={handleKeyPress}
            onCancleKeyPress={() => {
              setInput('');
              letters = [];
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flexDirection: 'column',
    height: Dimensions.get('screen').height + 80,
    width: Dimensions.get('screen').width,
    justifyContent: 'space-between',
    paddingVertical: 90,
    gap: 10,
  },
  verifyIntro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 30,
  },
  verifyInfo: {
    fontSize: 14,
    fontFamily: fonts.Vollkorn,
    opacity: 0.8,
  },
  verifyTitle: {
    fontSize: 40,
    marginVertical: 15,
    fontFamily: fonts.Bree,
  },
  textBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textInput: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    width: '15%',
    aspectRatio: 1,
    color: colors.LIGHT,
    fontSize: 24,
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.LIGHT_HIGHLIGHTED,
    borderRadius: 10,
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: 5,
    fontFamily: fonts.SourceCodeProSemiBold,
  },

  keypad: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 10,
    shadowColor: colors.LIGHT,
  },
  line: {
    margin: 25,
    width: '30%',
    height: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.LIGHT_HIGHLIGHTED,
    borderRadius: 50,
  },
  gap10: {
    gap: 15,
  },
  flexCol: {
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
  },
  forget: {
    fontFamily: fonts.Vollkorn,
    color: colors.LIGHT,
    opacity: 0.9,
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default VerifyScreen;
