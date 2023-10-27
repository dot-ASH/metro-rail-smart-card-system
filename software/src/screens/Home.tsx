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
  BackHandler,
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
import {decryptHash, encryptHash} from '../security/encryp';
import Entypo from 'react-native-vector-icons/Entypo';
import Payment from '../components/Payment';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function Home({navigation}: any): JSX.Element {
  const {darkMode, toggleOffDarkMode} = useContext(ThemeContext);
  const {user, setUsers} = useUserInfo();
  const [boxPosition, setBoxPosition] = useState('left');
  const [isHidden, setHidden] = useState(true);
  const [moduleVisible, setModuleVisible] = useState(false);
  const [balance, setBalance] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [elavatedBg, setElavatedBg] = useState(false);

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

  const semiTransparent = {
    backgroundColor: isDarkMode
      ? 'rgba(241, 234, 228, 0.1)'
      : 'rgba(50, 46, 47, 0.2)',
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
    navigation.navigate('ModuleStack');
  };

  const modules = [
    {
      title: 'Fare Chart',
      text: 'Know the trip fare to every destination',
      icon: (
        <Entypo
          name="stumbleupon-with-circle"
          size={32}
          color={isDarkMode ? colors.LIGHT_SHADE : colors.LIGHT_HIGHLIGHTED}
        />
      ),
      onModulePress: (event: any) => modalNav(event),
      color: null,
    },
    {
      title: 'How-tos',
      text: 'Instructions to use the app.',
      icon: (
        <FontAwesome5Icon
          name="info-circle"
          size={32}
          color={isDarkMode ? colors.LIGHT_SHADE : colors.LIGHT_HIGHLIGHTED}
        />
      ),
      onModulePress: (event: any) => modalNav(event),
    },
    {
      title: 'Terms and Conditions',
      text: 'Rules and convention to follow!',
      icon: (
        <FontAwesome5Icon
          name="exclamation-circle"
          size={32}
          color={isDarkMode ? colors.LIGHT_SHADE : colors.LIGHT_HIGHLIGHTED}
        />
      ),
      onModulePress: () => {
        setShowPayment(true);
        setElavatedBg(true);
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

  const decryptBalance = async () => {
    if (typeof user[0]?.user_data[0].balance !== 'undefined') {
      const newBalance = await decryptHash(user[0]?.user_data[0].balance);
      setBalance(newBalance);
    }
  };

  useEffect(() => {
    decryptBalance();
  });

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
              borderRadius: 20,
              elevation: 8,
              marginBottom: 30,
              backgroundColor: isDarkMode
                ? colors.DARK_HIGHLIGHTED
                : colors.DARK_SHADE,
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
                  {user[0]
                    ? fancify(user[0]?.user_data[0].user_index.toString())
                    : null}
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
                  {item.icon}
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
    position: 'relative',
    flexDirection: 'column',
    height: Dimensions.get('window').height + 80,
    width: Dimensions.get('window').width,
    paddingVertical: 50,
    marginBottom: 100,
  },
  sectionContainer: {
    marginTop: 40,
    marginHorizontal: 25,
    gap: 10,
  },
  elavatedbg: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: Dimensions.get('window').height + 80,
    width: Dimensions.get('window').width,
    zIndex: 2000,
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
    marginTop: 10,
    marginBottom: 180,
    gap: 15,
  },
  modules: {
    position: 'relative',
    width: '100%',
    padding: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 0.8,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    borderColor: colors.LIGHT_HIGHLIGHTED,
  },
  moduleTitle: {
    fontFamily: fonts.KarmaBold,
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
