/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */

import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Keyboard,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import CustomDigitKeyboard from '../components/CustomDigitKeyboard';
import {colors} from '../style/colors';
import {ThemeContext} from '../context/ThemeContext';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {fonts} from '../style/fonts';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../navigation/MainStack';
import CustomAlert from '../components/CustomAlert';
import supabase from '../data/supaBaseClient';

type verifyScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'Verify'
>;

interface verifyScreenProps {
  navigation: verifyScreenNavigationProp;
}

let letters: string[] = [];
const PHONE_REGEX = /^(01[0-9]{9})$/;
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
function OTPScreen({navigation}: verifyScreenProps): JSX.Element {
  const {darkMode} = useContext(ThemeContext);
  const [phone, setPhone] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isLoading, setLOading] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
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
  const [input, setInput] = useState('');

  const handleKeyPress = (key: string) => {
    if (input.length < 6) {
      setInput(prevInput => prevInput + key);
      letters.push(key);
    }
  };

  const setAlertText = (text: string) => {
    setAlert(text);
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  const checkReg = () => {
    const isOkay = PHONE_REGEX.test(phone);
    isOkay ? setPhoneVerified(true) : setPhoneVerified(false);
  };

  useEffect(() => {
    checkReg();
    if (verified) {
      Keyboard.dismiss();
    }
  });

  const sendOTP = async () => {
    const response = await supabase
      .from('user')
      .select('*')
      .eq('phn_no', '88' + phone);

    if (response.data && response.data?.length > 0) {
      const {data, error} = await supabase.auth.signInWithOtp({
        phone: '+88' + phone,
      });

      if (!error) {
        console.log(data);
        setVerified(true);
        setAlertText('OTP has been sent');
      } else {
        console.log(error);
        setAlertText(error.message);
      }
    } else {
      setAlertText("You aren't registered");
    }
  };

  const checkAuth = async () => {
    const {data, error} = await supabase.auth.getSession();
    if (!error) {
      console.log(data);
      return true;
    } else {
      console.log(error.toString());
      return false;
    }
  };

  const checkOTP = async () => {
    setInput('');
    if (input.length === 6) {
      const {data, error} = await supabase.auth.verifyOtp({
        phone: '+88' + phone,
        token: input,
        type: 'sms',
      });
      if (error) {
        setAlertText(error.toString());
      }
      await checkAuth();
      const hasSession = await checkAuth();
      hasSession
        ? navigation.navigate('Verify')
        : setAlertText('Something went wrong!');
    } else {
      setAlertText('You must enter 6 number');
    }
  };

  const resendOTP = async () => {
    const {error} = await supabase.auth.resend({
      type: 'sms',
      phone: '+88' + phone,
    });
    !error
      ? setAlertText('OTP has been resent')
      : setAlertText(error.toString());
  };

  const resetPhone = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPhoneVerified(false);
    setVerified(false);
    setPhone('');
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
        <View style={styles.otpIntro}>
          <View style={styles.gap10}>
            <Text style={[styles.otpTitle, textStyle]}>Login</Text>
            <Text style={[styles.otpInfo, textStyle]}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Consequuntur ipsa dicta officia illum obcaecati.
            </Text>
          </View>

          <View
            style={[
              styles.widthFull,
              {marginBottom: verified ? '-8%' : '20%'},
            ]}>
            <View style={styles.emailBox}>
              <TextInput
                style={[styles.emailInput, styles.timeZone]}
                value={' +88'}
                keyboardType="numeric"
                editable={false}
              />
              <TextInput
                style={styles.emailInput}
                onChangeText={setPhone}
                value={phone}
                keyboardType="numeric"
                editable={verified ? false : true}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                onPress={sendOTP}
                disabled={verified ? true : false}>
                <FontAwesome6Icon
                  name="arrows-turn-right"
                  size={28}
                  color={colors.LIGHT_HIGHLIGHTED}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.confirm}>
              <View
                style={[
                  styles.bulletPoint,
                  {
                    backgroundColor:
                      phoneVerified || verified
                        ? colors.VERIFIED
                        : colors.ERROR,
                  },
                ]}
              />
              {verified ? (
                <Text style={[styles.confirmText, textStyle]}>
                  {isLoading ? 'Wait a moment' : 'OTP has been sent'}
                </Text>
              ) : (
                <Text style={[styles.confirmText, textStyle]}>
                  {phoneVerified
                    ? 'Now request for OTP'
                    : 'Not a phone number!'}
                </Text>
              )}
              <TouchableOpacity
                style={{
                  display: verified ? 'flex' : 'none',
                  borderBottomWidth: 1,
                  borderBottomColor: colors.VERIFIED,
                }}
                onPress={resendOTP}>
                <Text style={[styles.confirmText, {color: colors.VERIFIED}]}>
                  Resend
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  display: verified ? 'flex' : 'none',
                  borderBottomWidth: 1,
                  borderBottomColor: colors.ERROR,
                }}
                onPress={resetPhone}>
                <Text style={[styles.confirmText, {color: colors.ERROR}]}>
                  Reset
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.flexCol, {display: verified ? 'flex' : 'none'}]}>
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
                <Text style={styles.input}>
                  {letters[5] ? letters[5] : ' '}
                </Text>
              </View>
              <TouchableOpacity onPress={checkOTP}>
                <FontAwesome5Icon
                  name="arrow-circle-right"
                  size={32}
                  color={colors.LIGHT_HIGHLIGHTED}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.keypad,
            {
              backgroundColor: isDarkMode ? colors.LIGHT : colors.DARK,
              bottom: verified ? '10%' : '-50%',
            },
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
    position: 'relative',
    flexDirection: 'column',
    height: Dimensions.get('screen').height + 80,
    width: Dimensions.get('screen').width,
    justifyContent: 'space-between',
    paddingVertical: 90,
    gap: 10,
  },
  otpIntro: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 30,
  },
  otpInfo: {
    fontSize: 14,
    fontFamily: fonts.Vollkorn,
    opacity: 0.8,
  },
  otpTitle: {
    fontSize: 40,
    marginVertical: 15,
    fontFamily: fonts.Bree,
  },
  emailBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emailInput: {
    width: '60%',
    fontFamily: fonts.KarmaSemiBold,
    letterSpacing: 1.5,
    paddingTop: 8,
    paddingHorizontal: 20,
    padding: 5,
    color: colors.LIGHT,
    fontSize: 18,
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.LIGHT_HIGHLIGHTED,
    borderRadius: 10,
  },
  timeZone: {
    width: 70,
    paddingHorizontal: 20,
  },

  confirm: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  bulletPoint: {
    width: 12,
    aspectRatio: 1,
    borderRadius: 50,
    marginTop: 3,
  },
  confirmText: {
    fontFamily: fonts.Vollkorn,
    color: colors.LIGHT,
    fontSize: 17,
  },
  textBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  textInput: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    width: '13%',
    aspectRatio: 1,
    color: colors.LIGHT,
    fontSize: 24,
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.LIGHT_HIGHLIGHTED,
    borderRadius: 10,
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: 3,
    fontFamily: fonts.SourceCodeProSemiBold,
  },

  keypad: {
    position: 'absolute',
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
  widthFull: {
    width: '100%',
    alignItems: 'center',
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

export default OTPScreen;
