/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  UIManager,
  LayoutAnimation,
  Image,
  BackHandler,
} from 'react-native';

import { colors } from '../style/colors';
import { useUserInfo } from '../context/AuthContext';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import '../../assets/fonts/Source Code Pro SemiBold.ttf';
import { ThemeContext } from '../context/ThemeContext';
import { fonts } from '../style/fonts';
import { decrypt } from '../security/encryp';
import Entypo from 'react-native-vector-icons/Entypo';
import supabase from '../data/supaBaseClient';
import CustomDialog from '../components/CustomDialog';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function Home({ navigation }: any): JSX.Element {
  const { darkMode, toggleOffDarkMode } = useContext(ThemeContext);
  const { user, refreshModule } = useUserInfo();
  const [boxPosition, setBoxPosition] = useState('left');
  const [isHidden, setHidden] = useState(true);
  const [moduleVisible, setModuleVisible] = useState(false);
  const [balance, setBalance] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [elavatedBg, setElavatedBg] = useState(false);
  const [ongoingTrip, setOngoing] = useState(false);
  const [showDialoue, setShowDialoue] = useState(false);
  const [pushNoti, setPushNoti] = useState(false);

  const isDarkMode = darkMode;
  const defaultIndex = user[0].default_index;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.DARK : colors.LIGHT,
  };
  const textStyle = {
    color: isDarkMode ? colors.LIGHT_ALT : colors.DARK,
  };

  const textStyleAlt = {
    color: !isDarkMode ? colors.LIGHT_ALT : colors.DARK,
  };

  const checkInsertSubcription = async () => {
    try {
      supabase.channel('custom-insert-channel')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'transaction', filter: `user_index=eq.${user[defaultIndex]?.user_data[0].user_index}` },
          (payload) => {
            console.log('insert received!', payload.new.type);
            if (payload.new.type == 'ongoing') {
              setOngoing(true);
              sendNotification(user[defaultIndex].name);
            }
          }
        )
        .subscribe()
    } catch (error) {
      console.error('Error fetching sub data:', error);
    }
  };

  const checkUpdateSubcription = async () => {
    try {
      supabase.channel('custom-filter-channel')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'transaction', filter: `user_index=eq.${user[defaultIndex]?.user_data[0].user_index}` },
          (payload) => {
            console.log('update received!', payload);
            if (payload.new.type == 'spnt') {
              setOngoing(false);
              clearNotification();
            }
          }
        )
        .subscribe()
    } catch (error) {
      console.error('Error fetching sub data:', error);
    }
  };

  const checkOnGoing = async () => {
    const { data } = await supabase.from("transaction").select("*").eq('user_index', user[defaultIndex]?.user_data[0].user_index).eq('type', 'ongoing');
    if (data && data?.length > 0) {
      setOngoing(true);
    } else {
      setOngoing(false);
    }
  }

  const switchMode = () => {
    toggleOffDarkMode();
  };

  const animateHover = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setBoxPosition(boxPosition === 'left' ? 'right' : 'left');
  };

  const modalNav = (e: any, screenName: string) => {
    e.preventDefault();
    navigation.navigate(screenName);
  };

  const getStorageValue = async () => {
    try {
      const value = await AsyncStorage.getItem('pushNotiValue');
      if (value !== null) {
        value === 'true' ? setPushNoti(true) : setPushNoti(false);
      }
    } catch (error: any) {
      console.log('getStorage:', error);
    }
  };

  const sendNotification = (name: string) => {
    if (pushNoti) {
      PushNotification.localNotification({
        channelId: '123',
        id: '123',
        message: "You have an ongoin trip",
        title: name,
        soundName: 'my_sound.mp3',
      });
    }
  }

  const clearNotification = () => {
    if (pushNoti) {
      PushNotification.cancelLocalNotification('123');
    }
  }

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
      onModulePress: (event: any) => modalNav(event, "FareChart"),
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
      onModulePress: (event: any) => modalNav(event, "HowTos"),

    },
    {
      text: 'Rules and convention to follow!',
      title: 'Terms and Conditions',
      icon: (
        <FontAwesome5Icon
          name="exclamation-circle"
          size={32}
          color={isDarkMode ? colors.LIGHT_SHADE : colors.LIGHT_HIGHLIGHTED}
        />
      ),
      onModulePress: (event: any) => modalNav(event, "Terms"),
    },
  ];

  const fancify = (user_index: string): string => {
    let newString;
    let fancyString = '';

    isHidden
      ? (newString =
        '********' +
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

  const decryptBalance = () => {
    if (typeof user[defaultIndex]?.user_data[0].balance !== 'undefined') {
      const newBalance = decrypt(
        user[defaultIndex]?.user_data[0].balance,
      );
      setBalance(newBalance.toString());
    }
  };

  const blockEm = async () => {
    const { error } = await supabase.from('suspend').insert({
      user_index: user[defaultIndex]?.user_data[0].user_index,
      reason: 'stolen card',
    });
    if (error) {
      console.log('blockEm', error.message);
      return;
    }
    refreshModule();
    setShowDialoue(false);
    setElavatedBg(false);
  };

  useEffect(() => {
    checkInsertSubcription();
    checkUpdateSubcription();
  })

  useEffect(() => {
    checkOnGoing();
  }, [])

  useEffect(() => {
    decryptBalance();
    getStorageValue();
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
      {elavatedBg ? <View style={styles.elavatedbg} /> : null}
      <CustomDialog isVisible={showDialoue} title={"Alert!!"} onConfirm={blockEm}
        text={"Do you want to block this card?"}
        onCancle={() => (setShowDialoue(false), setElavatedBg(false))} />

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
            <View style={{ flexDirection: 'column' }}>
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
                <View style={[{ marginRight: 5, opacity: isHidden ? 0.3 : 0.8 }]}>
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
              <View style={{ justifyContent: 'center', gap: 10 }}>
                <Text
                  style={[
                    { fontSize: 34, fontFamily: fonts.Quantico },
                    textStyleAlt,
                  ]}>
                  {user[defaultIndex]
                    ? fancify(
                      user[defaultIndex]?.user_data[0].user_index.toString(),
                    )
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
                  {user[defaultIndex]?.name}
                </Text>
              </View>
            </View>
          </View>
          {/* MODULES */}
          <View style={[styles.moduleContainer]}>
            {ongoingTrip ? <View style={[styles.modules, , {
              backgroundColor: isDarkMode
                ? 'rgba(241, 234, 228, 0.09)'
                : 'rgba(50, 46, 47, 0.09)',
            }]}>
              <Entypo
                name="500px-with-circle"
                size={32}
                color={colors.WARNING}
              />

              <TouchableOpacity
                onPress={() => (setShowDialoue(true), setElavatedBg(true))}>
                <Text style={[styles.moduleTitle, { color: isDarkMode ? colors.ERROR : '#c03d28' }]}>
                  Onging Trip
                </Text>
                <Text style={[styles.moduleText, { color: colors.WARNING }]}>
                  Not you? Block it now!
                </Text>
              </TouchableOpacity>
            </View> : null}

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
