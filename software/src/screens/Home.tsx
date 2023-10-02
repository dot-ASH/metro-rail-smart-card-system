/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Button,
  Platform,
  UIManager,
  LayoutAnimation,
  Image,
} from 'react-native';

import {colors} from '../style/colors';
import supabase from '../data/supaBaseClient';
import {useUserInfo} from '../context/AuthContext';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import '../../assets/fonts/Source Code Pro SemiBold.ttf';
import {ThemeContext} from '../context/ThemeContext';
import {fonts} from '../style/fonts';
import CustomModal from '../components/modules/CustomModal';
import {decryptHash} from '../security/encryp';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function Home({navigation}: any): JSX.Element {
  const {darkMode, toggleOffDarkMode} = useContext(ThemeContext);
  const {user, setUsers, token, setToken} = useUserInfo();
  const [boxPosition, setBoxPosition] = useState('left');
  const [isHidden, setHidden] = useState(true);
  const [moduleVisible, setModuleVisible] = useState(false);
  const [balance, setBalance] = useState('');

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

  const switchMode = () => {
    toggleOffDarkMode();
  };

  const animateHover = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setBoxPosition(boxPosition === 'left' ? 'right' : 'left');
  };

  const modalNav = (e: any) => {
    e.preventDefault();
    navigation.push('ModuleStack');
    // visible ? setVisible(false) : setVisible(true);
  };

  const handleLogin = () => {
    // Implement your authentication logic here, and when you get the token, set it using `setToken`
    const authToken = 'your_generated_token'; // Replace with your authentication logic
    setToken(authToken);

    // Optionally, you can store the token in AsyncStorage or elsewhere
    // AsyncStorage.setItem('authToken', authToken);
  };

  const handleLogout = () => {
    // Log out the user by clearing the token
    setToken(null);

    // Optionally, remove the token from AsyncStorage or wherever it's stored
    // AsyncStorage.removeItem('authToken');
  };
  const modules = [
    {
      title: 'Fare Chart',
      text: 'Know the trip fare to every destination',
      icon: 'file',
      onModulePress: (event: any) => modalNav(event),
    },
    {
      title: 'Module Name',
      text: 'they are coming for you man beware',
      icon: 'file',
      onModulePress: () => {
        console.log('heii');
      },
    },
    {
      title: 'Module Name',
      text: 'they are coming for you man beware',
      icon: 'file',
      onModulePress: () => {
        console.log('heii');
      },
    },
    {
      title: 'Module Name',
      text: 'they are coming for you man beware',
      icon: 'file',
      onModulePress: () => {
        console.log('heii');
      },
    },
    {
      title: 'Module Name',
      text: 'they are coming for you man beware',
      icon: 'file',
      onModulePress: () => {
        console.log('heii');
      },
    },
  ];

  const fancify = (user_index: string): string => {
    let newString;
    let fancyString = '';

    isHidden
      ? (newString =
          '******' +
          user_index?.charAt(user_index.length - 3) +
          user_index?.charAt(user_index.length - 2) +
          user_index?.charAt(user_index.length - 1))
      : (newString = user_index);

    for (let i = 0; i < newString?.length; i++) {
      fancyString += newString?.charAt(i);
      if ((i + 1) % 3 === 0 && i !== newString?.length - 1) {
        fancyString += ' ';
      }
    }
    return fancyString;
  };

  const decryptBalance = async (input: string) => {
    setBalance(await decryptHash(input));
  };
  useEffect(() => {
    if (token) {
    }
  }, [token]);

  useEffect(() => {
    decryptBalance(user[0]?.balance);
  });

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.TRANPARENT}
        translucent={true}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[backgroundStyle, styles.screenContainer]}>
        {/* HEADER */}
        <View
          style={[
            styles.sectionContainer,
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              gap: 20,
              alignItems: 'center',
              marginLeft: 5,
            }}>
            <FontAwesome6Icon
              name="bangladeshi-taka-sign"
              size={42}
              color={
                isDarkMode ? colors.DARK_HIGHLIGHTED : colors.LIGHT_HIGHLIGHTED
              }
            />
            <View style={{flexDirection: 'column'}}>
              <Text style={[styles.balanceLabel, textStyle]}>Balance</Text>
              <Text style={[textStyle, styles.balance]}>
                {isHidden ? '****' : balance}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              switchMode();
              animateHover();
            }}
            style={[
              styles.switchBtn,
              {
                backgroundColor: isDarkMode
                  ? colors.DARK_HIGHLIGHTED
                  : colors.LIGHT_HIGHLIGHTED,
                shadowColor: isDarkMode ? colors.LIGHT : colors.DARK,
              },
            ]}>
            <IonIcon
              name={isDarkMode ? 'moon' : 'sunny'}
              size={28}
              style={isDarkMode ? styles.moveLeft : styles.moveRight}
              color={isDarkMode ? colors.DARK_ALT : colors.LIGHT}
            />
          </TouchableOpacity>
        </View>
        {/* BODY */}
        <View style={styles.sectionContainer}>
          <View
            style={{
              flex: 1,
              height: 230,
              borderRadius: 30,
              elevation: 10,
              marginBottom: 30,
              backgroundColor: isDarkMode
                ? colors.DARK_HIGHLIGHTED
                : colors.LIGHT_HIGHLIGHTED,
              shadowColor: isDarkMode ? colors.LIGHT : colors.DARK_LIGHT,
            }}>
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Image
                  source={
                    isDarkMode
                      ? require('../../assets/logo.png')
                      : require('../../assets/logo_light.png')
                  }
                  resizeMode="contain"
                  style={{
                    width: 50,
                    aspectRatio: 1,
                    position: 'relative',
                    opacity: 0.55,
                    marginLeft: 5,
                  }}
                />
                <View style={[{marginRight: 5, opacity: isHidden ? 0.3 : 0.8}]}>
                  <IonIcon
                    name="eye"
                    size={26}
                    color={isDarkMode ? colors.DARK : colors.LIGHT_ALT}
                    onPress={() =>
                      isHidden ? setHidden(false) : setHidden(true)
                    }
                  />
                </View>
              </View>
              <View style={{justifyContent: 'center', gap: 10}}>
                <Text
                  style={[
                    {fontSize: 40, fontFamily: fonts.Quantico},
                    textStyleAlt,
                  ]}>
                  {user[0] ? fancify(user[0]?.user_index.toString()) : null}
                </Text>
                <Text
                  style={[
                    {
                      fontSize: 20,
                      fontFamily: fonts.Bree,
                      letterSpacing: 1,
                    },
                    textStyleAlt,
                  ]}>
                  {user[0]?.name}
                </Text>
              </View>
            </View>
          </View>
          {/* MODULES */}
          <View style={styles.moduleContainer}>
            {modules.map((item, key) => {
              return (
                <View style={[styles.modules]} key={key}>
                  <FontAwesome5Icon
                    name={item.icon}
                    size={32}
                    color={colors.LIGHT_HIGHLIGHTED}
                  />
                  <TouchableOpacity
                    onPress={(event: any) => item.onModulePress(event)}>
                    <Text style={[styles.moduleTitle, textStyle]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.moduleText, textStyle]}>
                      {item.text}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flexDirection: 'column',
    height: Dimensions.get('window').height + 80,
    width: Dimensions.get('window').width,
    paddingVertical: 50,
    marginBottom: 100,
  },
  sectionContainer: {
    marginTop: 35,
    marginHorizontal: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    margin: 30,
    fontFamily: fonts.Bree,
  },
  switchBtn: {
    width: 60,
    height: 37,
    backgroundColor: 'black',
    borderRadius: 40,
    justifyContent: 'center',
    elevation: 15,
    marginRight: 5,
  },
  balance: {
    fontSize: 24,
    fontFamily: fonts.SourceCodeProSemiBold,
    letterSpacing: 3,
  },
  balanceLabel: {
    fontSize: 17,
    fontFamily: fonts.Vollkorn,
    color: colors.LIGHT_HIGHLIGHTED,
  },
  moveRight: {
    position: 'absolute',
    borderRadius: 40,
    right: 7,
  },
  moveLeft: {
    position: 'absolute',
    borderRadius: 40,
    left: 7,
  },
  card: {
    padding: 30,
    paddingHorizontal: 35,
    justifyContent: 'space-between',
    flexDirection: 'column',
    gap: 20,
  },
  moduleContainer: {
    marginTop: 15,
    marginBottom: 180,
    gap: 15,
  },
  modules: {
    position: 'relative',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderColor: colors.LIGHT_HIGHLIGHTED,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  moduleTitle: {
    fontFamily: fonts.KarmaSemiBold,
    fontSize: 17,
  },
  moduleText: {
    fontSize: 14,
    flexWrap: 'wrap',
    marginRight: 40,
    lineHeight: 20,
    fontFamily: fonts.Vollkorn,
    opacity: 0.7,
  },
});

export default Home;
