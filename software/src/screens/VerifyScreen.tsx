/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect, useCallback} from 'react';
import {
  BackHandler,
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
import CustomAlert from '../components/CustomAlert';
import Octicons from 'react-native-vector-icons/Octicons';
import Customloading from '../components/CustomLoading';
import supabase from '../data/supaBaseClient';

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
  const [alert, setAlert] = useState<string>();
  const [isLoading, setLoading] = useState(false);
  const [isBlocked, setBlock] = useState<boolean>(false);
  const [count, setCount] = useState<number>(1);
  const isDarkMode = darkMode;
  const defaultIndex = user[0]?.default_index;
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.DARK : colors.LIGHT,
  };
  const textStyle = {
    color: isDarkMode ? colors.LIGHT_ALT : colors.DARK,
  };

  const [input, setInput] = useState('');

  const handleKeyPress = (key: string) => {
    if (input.length < 5) {
      setInput(prevInput => prevInput + key);
      letters.push(key);
    }
  };

  const blockEm = async () => {
    const {error} = await supabase.from('suspend').insert({
      user_index: user[defaultIndex]?.user_data[0].user_index,
      reason: 'wrong attempts',
    });
    if (error) {
      console.log('blockEm', error.message);
      return;
    }
    setBlock(true);
  };

  const getBlocked = useCallback(async () => {
    const {data, error} = await supabase
      .from('suspend')
      .select('*')
      .eq('user_index', user[defaultIndex]?.user_data[0]?.user_index);
    if (error) {
      console.log('getBlock', error.message);
      return;
    }
    data.length > 0 ? setBlock(true) : setBlock(false);
  }, [defaultIndex, user]);

  const setAlertText = (text: string) => {
    setAlert(text);
    setTimeout(() => {
      setAlert('');
    }, 4000);
  };

  const verifyPin = async () => {
    if (!input) {
      setAlertText('Enter your PIN');
      return;
    }
    setLoading(true);
    const pinMatches = await compareSHA(
      input,
      user[defaultIndex]?.user_data[0].verify_pin,
    );
    if (pinMatches) {
      setInput('');
      letters = [];
      setLoading(false);
      navigation.push('AppStack');
    } else {
      setLoading(false);
      setInput('');
      setCount(prev => prev + 1);
      letters = [];
      if (count > 4) {
        await blockEm();
        return;
      }
      setAlertText(
        count > 2 ? `warning: ${count} times failure` : "PIN doesn't match",
      );
    }
  };

  useEffect(() => {
    if (user[defaultIndex]) {
      getBlocked();
    }
  }, [defaultIndex, getBlocked, user]);

  useEffect(() => {
    user[defaultIndex] ? setLoading(false) : setLoading(true);
  }, [defaultIndex, user]);

  useEffect(() => {
    const handleBackButton = () => {
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.TRANPARENT}
        translucent={true}
      />
      <CustomAlert isVisible={alert ? true : false} text={alert} />
      <Customloading isVisible={isLoading} />
      <View style={styles.screenContainer}>
        {isBlocked ? (
          <View style={styles.elavatedbg}>
            <View
              style={[
                backgroundStyle,
                {
                  width: '85%',
                  borderRadius: 20,
                  elevation: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 30,
                  padding: 40,
                },
              ]}>
              <Octicons name="blocked" size={44} color={colors.ERROR} />
              <Text
                style={[
                  textStyle,
                  {fontFamily: fonts.KarmaBold, fontSize: 22},
                ]}>
                You are blocked
              </Text>
              <Text
                style={[
                  textStyle,
                  {
                    marginTop: -30,
                    fontFamily: fonts.Vollkorn,
                    fontSize: 16,
                    opacity: 0.8,
                  },
                ]}>
                contact service center
              </Text>
            </View>
          </View>
        ) : null}
        <View style={styles.verifyIntro}>
          <View style={styles.gap10}>
            <Text style={[styles.verifyTitle, textStyle]}>Verify</Text>
            <Text style={[styles.verifyInfo, textStyle]}>
              Verify yourself. Enter your PIN. Consecutive 5 times wrong attemps
              will get you banned!
            </Text>
          </View>

          <View style={styles.flexCol}>
            <View style={styles.textBox}>
              <View style={styles.textInput}>
                <Text style={styles.input}>{letters[0] ? '*' : ' '}</Text>
                <Text style={styles.input}>{letters[1] ? '*' : ' '}</Text>
                <Text style={styles.input}>{letters[2] ? '*' : ' '}</Text>
                <Text style={styles.input}>{letters[3] ? '*' : ' '}</Text>
                <Text style={styles.input}>{letters[4] ? '*' : ' '}</Text>
              </View>
              <TouchableOpacity onPress={verifyPin}>
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
    height: Dimensions.get('screen').height + 10,
    width: Dimensions.get('screen').width,
    justifyContent: 'space-between',
    paddingTop: 90,
    gap: 10,
  },

  verifyIntro: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 30,
  },

  elavatedbg: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: Dimensions.get('window').height + 80,
    width: Dimensions.get('window').width,
    zIndex: 2000,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: fonts.SourceCodeProBold,
  },

  keypad: {
    width: Dimensions.get('screen').width,
    justifyContent: 'center',
    alignItems: 'center',
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
