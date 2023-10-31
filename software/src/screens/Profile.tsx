/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import {colors} from '../style/colors';
import {useUserInfo} from '../context/AuthContext';
import supabase from '../data/supaBaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../components/CustomAlert';
import Customloading from '../components/CustomLoading';
import CustomDialog from '../components/CustomDialog';
import {sha256HashPin, encryptHash, decryptHash} from '../security/encryp';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../navigation/MainStack';
import Feather from 'react-native-vector-icons/Feather';
import {fonts} from '../style/fonts';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import OnboardingScreen from './OnboardingScreen';
import GestureRecognizer from 'react-native-swipe-gestures';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import Draggable from 'react-native-draggable';
import DropDownPicker from 'react-native-dropdown-picker';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'AuthStack'
>;

interface NavigationScreenProp {
  navigation: ScreenNavigationProp;
}

interface StationDataProps {
  station_name: string;
  station_code: string;
  distance: number;
}

interface StationNameProps {
  label: string;
  value: string;
}

const PASS_REGEX = /^\d{5}$/;
const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

function Profile({navigation}: NavigationScreenProp): JSX.Element {
  const {darkMode, toggleOffDarkMode} = useContext(ThemeContext);
  const {user, setUsers} = useUserInfo();
  const [dialog, setDialog] = useState(false);
  const [alert, setAlert] = useState('');
  const [elavatedBg, setElavatedBg] = useState(false);
  const [addrModule, setAddrModule] = useState(false);
  const [accModule, setAccModule] = useState(false);
  const [ifLoading, setIfLoading] = useState(false);
  const [ifSuccess, setIfSuccess] = useState(false);
  const [ifWrong, setIfWrong] = useState(false);
  const [psModule, setPassModule] = useState(false);
  const [settingModule, setSettingModule] = useState(false);
  const [defaultDark, setDefaultDark] = useState(false);
  const [pushNoti, setPushNoti] = useState(false);
  const [passForm, setPassForm] = useState({
    newPass: '',
    confirmPass: '',
  });

  const [dialogInfo, setDialogInfo] = useState({
    title: '',
    text: '',
    onConfirm: () => {},
  });

  const [stationData, setStationData] = useState<StationDataProps[]>();
  const [stationName, setStationName] = useState<StationNameProps[]>([]);
  const [visible, setVisible] = useState<boolean>();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [sortValue, setSortValue] = useState('');
  const [items, setItems] = useState([
    {label: 'Sorted by recent', value: 'recent'},
    {label: 'Sorted by high amount', value: 'amount'},
  ]);

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

  const getStorageValue = async () => {
    try {
      const value = await AsyncStorage.getItem('pushNotiValue');
      if (value !== null) {
        value === 'true' ? setPushNoti(true) : setPushNoti(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const setStorageValue = async (valueName: string, value: string) => {
    try {
      await AsyncStorage.setItem(valueName, value);
    } catch (error: any) {
      console.log(error);
    }
  };

  const setAlertText = (text: string) => {
    setAlert(text);
    setTimeout(() => {
      setAlert('');
    }, 6000);
  };

  const onChangePassHandler = (value: string, name: string) => {
    setPassForm(form => ({
      ...form,
      [name]: value,
    }));
  };

  const changePin = async () => {
    clearCustoms();
    let errorLog = '';
    passForm.newPass !== passForm.confirmPass
      ? (errorLog = "PIN doesn't match")
      : !PASS_REGEX.test(passForm.newPass)
      ? (errorLog = 'Enter a valid PIN')
      : null;

    if (errorLog) {
      setAlertText(errorLog);
    } else {
      setIfLoading(true);
      const hashedpPIN = await sha256HashPin(passForm.newPass);
      const {error} = await supabase
        .from('user_data')
        .update({verify_pin: hashedpPIN})
        .eq('phn_no', user[0].phn_no);
      if (error) {
        setIfLoading(false);
        setAlertText('Somethings wrong! try again');
      } else {
        setIfLoading(false);
        setAlertText('Your PIN has been changed');
      }
    }
  };

  const handleDeafultDark = () => {
    setDefaultDark(prev => !prev);
    // if (defaultDark) {
    //   setDefaultDark(false);
    //   setStorageValue('defaultDarkValue', 'false');
    // } else {
    //   setDefaultDark(true);
    //   setStorageValue('defaultDarkValue', 'true');
    // }
  };

  const handlePushNoti = () => {
    if (defaultDark) {
      setPushNoti(false);
      setStorageValue('pushNotiValue', 'false');
    } else {
      setPushNoti(true);
      setStorageValue('pushNotiValue', 'true');
    }
  };

  const signout = async () => {
    const {error} = await supabase.auth.signOut();
    if (!error) {
      setDialog(false);
      navigation.reset({
        index: 0,
        routes: [{name: 'AuthStack'}],
      });

      navigation.navigate('AuthStack');
    }
  };

  const getAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: {type: 'easeIn', property: 'opacity'},
    });
  };

  const clearCustoms = () => {
    setAlert('');
    setIfLoading(false);
    setIfSuccess(false);
    setIfWrong(false);
  };

  useEffect(() => {
    getStorageValue();
  }, []);

  const getStation = useCallback(async () => {
    const {data, error} = await supabase
      .from('station')
      .select('station_code, station_name, distance')
      .order('distance');
    if (!error) {
      setStationData(data);
    }
  }, []);

  const updateUser = useCallback(async () => {
    if (sortValue && sortValue !== user[0].address) {
      const {error} = await supabase
        .from('user')
        .update({address: sortValue})
        .eq('phn_no', user[0].phn_no);
    }
  }, [sortValue, user]);

  const setUserD = async () => {
    const {error} = await supabase
      .from('user')
      .update({address: null})
      .eq('phn_no', user[0].phn_no);
  };

  useEffect(() => {
    updateUser();
  }, [updateUser]);

  useEffect(() => {
    getStation();
  }, [getStation]);

  useEffect(() => {
    if (stationData) {
      setLoading(false);
      let newStationName = stationData?.map(obj => {
        return {
          label: obj.station_name,
          value: obj.station_code,
        };
      });
      setStationName(newStationName);
    } else {
      setLoading(true);
    }
  }, [stationData]);

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.TRANPARENT}
        translucent={true}
      />
      {elavatedBg ? <View style={styles.elavatedbg} /> : null}

      {/* CUSTOMS */}
      <CustomDialog
        isVisible={dialog}
        title={dialogInfo.title}
        text={dialogInfo.text}
        onCancle={() => setDialog(false)}
        onConfirm={dialogInfo.onConfirm}
      />
      <CustomAlert isVisible={alert.length > 0} text={alert} />

      {/* CHANGE PIN */}
      {psModule ? (
        <View style={styles.gestureStyle}>
          <Draggable
            x={SCREEN_WIDTH / 2 - (SCREEN_WIDTH - 40) / 2}
            y={SCREEN_HEIGHT / 3}
            touchableOpacityProps={{activeOpacity: 1}}>
            <View
              style={[
                backgroundStyle,
                {
                  width: SCREEN_WIDTH - 40,
                  borderRadius: 20,
                  elevation: 20,
                  padding: 10,
                },
              ]}>
              <Customloading isVisible={ifLoading} />
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: isDarkMode
                    ? colors.DARK_LIGHT
                    : 'rgba(0, 0, 0, 0.1)',
                  width: '100%',
                  paddingVertical: 20,
                  paddingHorizontal: 30,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={[
                    textStyle,
                    {
                      textAlign: 'center',
                      fontFamily: fonts.Bree,
                      fontSize: 20,
                    },
                  ]}>
                  Change PIN
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    getAnimation();
                    clearCustoms();
                    setPassModule(false);
                    setElavatedBg(false);
                  }}
                  style={{alignSelf: 'flex-end'}}>
                  <FontAwesome6Icon
                    size={20}
                    name="xmark"
                    style={[textStyle]}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  paddingVertical: 10,
                  alignItems: 'center',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  width: '100%',
                  gap: 20,
                  marginTop: 20,
                }}>
                <View style={[styles.inputContainer, {width: '80%'}]}>
                  <Text style={[textStyle, styles.label]}>New PIN: </Text>
                  <TextInput
                    style={[textStyle, styles.textInput]}
                    value={passForm.newPass}
                    onChangeText={value =>
                      onChangePassHandler(value, 'newPass')
                    }
                    secureTextEntry={true}
                  />
                </View>

                <View style={[styles.inputContainer, {width: '80%'}]}>
                  <Text style={[textStyle, styles.label]}>Confirm PIN: </Text>
                  <TextInput
                    style={[textStyle, styles.textInput]}
                    value={passForm.confirmPass}
                    onChangeText={value =>
                      onChangePassHandler(value, 'confirmPass')
                    }
                    secureTextEntry={true}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    backgroundStyleAlt,
                    {
                      alignSelf: 'center',
                      borderRadius: 10,
                      padding: 10,
                      marginBottom: 10,
                    },
                  ]}
                  onPress={changePin}>
                  <Text style={[styles.label, textStyleAlt]}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Draggable>
        </View>
      ) : null}

      {/* SETTINGS */}
      {settingModule ? (
        <GestureRecognizer
          onSwipeDown={() => {
            getAnimation();
            clearCustoms();
            setPassModule(false);
            setElavatedBg(false);
          }}
          style={styles.gestureStyle}>
          <View
            style={[
              backgroundStyle,
              {
                width: '85%',
                borderRadius: 20,
                elevation: 20,
              },
            ]}>
            <Customloading isVisible={ifLoading} />
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: isDarkMode
                  ? colors.DARK_LIGHT
                  : 'rgba(0, 0, 0, 0.1)',
                width: '100%',
                paddingVertical: 20,
                paddingHorizontal: 30,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={[
                  textStyle,
                  {
                    textAlign: 'center',
                    fontFamily: fonts.Bree,
                    fontSize: 20,
                  },
                ]}>
                Settings
              </Text>
              <TouchableOpacity
                onPress={() => {
                  getAnimation();
                  clearCustoms();
                  setSettingModule(false);
                  setElavatedBg(false);
                }}
                style={{alignSelf: 'flex-end'}}>
                <FontAwesome6Icon size={20} name="xmark" style={textStyle} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                paddingVertical: 20,
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '100%',
                gap: 10,
              }}>
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderWidth: 0,
                    width: '90%',
                    justifyContent: 'space-between',
                  },
                ]}>
                <Text style={[textStyle, styles.label]}>
                  Default (dark mode)
                </Text>
                <Switch
                  trackColor={{
                    false: isDarkMode
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(0, 0, 0, 0.2)',
                    true: isDarkMode
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(0, 0, 0, 0.4)',
                  }}
                  thumbColor={
                    defaultDark && isDarkMode
                      ? colors.LIGHT
                      : !defaultDark && isDarkMode
                      ? colors.LIGHT_HIGHLIGHTED
                      : defaultDark && !isDarkMode
                      ? colors.DARK_SHADE
                      : colors.DARK_LIGHT
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={handleDeafultDark}
                  value={defaultDark}
                />
              </View>
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderWidth: 0,
                    width: '90%',
                    justifyContent: 'space-between',
                  },
                ]}>
                <Text style={[textStyle, styles.label]}>Push Notification</Text>
                <Switch
                  trackColor={{
                    false: isDarkMode
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(0, 0, 0, 0.2)',
                    true: isDarkMode
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(0, 0, 0, 0.4)',
                  }}
                  thumbColor={
                    pushNoti && isDarkMode
                      ? colors.LIGHT
                      : !pushNoti && isDarkMode
                      ? colors.LIGHT_HIGHLIGHTED
                      : pushNoti && !isDarkMode
                      ? colors.DARK_SHADE
                      : colors.DARK_LIGHT
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={handlePushNoti}
                  value={pushNoti}
                />
              </View>
            </View>
          </View>
        </GestureRecognizer>
      ) : null}

      {/* PROFILE PAGE */}
      <View style={styles.vagueCircle} />
      <View style={[styles.bottomCircle]} />
      <View style={styles.screenContainer}>
        <View style={styles.profileConatiner}>
          <View style={styles.profileDp}>
            <View style={styles.dp}>
              <FontAwesome5Icon
                name="user-astronaut"
                size={84}
                color={colors.DARK}
              />
            </View>
            <View style={styles.gap20}>
              <Text style={[styles.name, textStyle]}>{user[0].name}</Text>
              <Text
                style={[
                  textStyle,
                  styles.address,
                  semiTransparent,
                  {borderRadius: 5, paddingHorizontal: 10, paddingBottom: 3},
                ]}>
                +{user[0].phn_no}
              </Text>
              <View>
                <DropDownPicker
                  open={dropDownOpen}
                  value={sortValue}
                  items={stationName}
                  setOpen={setDropDownOpen}
                  setValue={setSortValue}
                  setItems={setStationName}
                  style={styles.sort}
                  textStyle={[textStyle, {textAlign: 'right', flex: 0}]}
                  listItemLabelStyle={textStyle}
                  placeholder={
                    user[0].station?.station_name ||
                    "You haven't set your station yet"
                  }
                  placeholderStyle={[textStyle, styles.address]}
                  dropDownContainerStyle={{
                    backgroundColor: isDarkMode ? '#3B3637' : '#E7E0DB',
                    borderWidth: 0,
                    elevation: 10,
                    paddingHorizontal: 12,
                    paddingBottom: 15,
                    paddingTop: 10,
                    borderRadius: 10,
                    width: '65%',
                    marginLeft: sortValue === '' ? 0 : -50,
                  }}
                  showTickIcon={true}
                  ArrowDownIconComponent={() => (
                    <Feather
                      name="edit"
                      size={18}
                      style={[textStyle, {opacity: 0.8, elevation: 5}]}
                    />
                  )}
                  ArrowUpIconComponent={({style}) => (
                    <Entypo name="chevron-up" size={16} style={textStyle} />
                  )}
                  TickIconComponent={({style}) => (
                    <Entypo name="check" size={16} style={textStyle} />
                  )}
                  scrollViewProps={{endFillColor: 'black'}}
                  loading={isLoading}
                />
              </View>
            </View>
          </View>
          <View style={styles.menuContainer}>
            <View style={styles.menu}>
              <MaterialIcons
                name="supervised-user-circle"
                size={34}
                color={
                  isDarkMode ? colors.LIGHT_SHADE : colors.LIGHT_HIGHLIGHTED
                }
                style={{flex: 0.7, textAlign: 'right'}}
              />
              <TouchableOpacity style={{flex: 1}} onPress={setUserD}>
                <Text style={[textStyle, styles.itemName]}>Edit profile</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.menu}>
              <Entypo
                name="flickr-with-circle"
                size={30}
                color={
                  isDarkMode ? colors.LIGHT_SHADE : colors.LIGHT_HIGHLIGHTED
                }
                style={{flex: 0.7, textAlign: 'right'}}
              />
              <TouchableOpacity
                style={{flex: 1}}
                onPress={() => {
                  getAnimation();
                  setElavatedBg(true);
                  setPassModule(true);
                }}>
                <Text style={[textStyle, styles.itemName]}>Change PIN</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.menu}>
              <MaterialIcons
                name="build-circle"
                size={34}
                color={
                  isDarkMode ? colors.LIGHT_SHADE : colors.LIGHT_HIGHLIGHTED
                }
                style={{flex: 0.7, textAlign: 'right'}}
              />
              <TouchableOpacity
                style={{flex: 1}}
                onPress={() => {
                  getAnimation();
                  setElavatedBg(true);
                  setSettingModule(true);
                }}>
                <Text style={[textStyle, styles.itemName]}>Settings</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.menu}>
              <MaterialIcons
                name="run-circle"
                size={34}
                color={
                  isDarkMode ? colors.LIGHT_SHADE : colors.LIGHT_HIGHLIGHTED
                }
                style={{flex: 0.7, textAlign: 'right'}}
              />
              <TouchableOpacity
                onPress={() => {
                  setDialog(true);
                  setDialogInfo({
                    title: 'Signout',
                    text: 'Do you really want to exit?',
                    onConfirm: signout,
                  });
                }}
                style={{flex: 1}}>
                <Text style={[textStyle, styles.itemName]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  screenContainer: {
    flexDirection: 'column',
    height: Dimensions.get('window').height + 80,
    width: Dimensions.get('window').width,
    paddingVertical: 50,
    marginBottom: 100,
  },
  profileConatiner: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 100,
  },
  profileDp: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 25,
  },
  dp: {
    width: 130,
    aspectRatio: 0.9,
    borderRadius: 100,
    backgroundColor: colors.DARK_HIGHLIGHTED,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontFamily: fonts.Bree,
    fontSize: 24,
  },
  address: {
    fontFamily: fonts.Vollkorn,
    fontSize: 16,
    opacity: 0.7,
  },
  menuContainer: {
    flex: 0.8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  menu: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 40,
  },
  itemName: {
    fontFamily: fonts.KarmaBold,
    fontSize: 17,
    textAlign: 'left',
  },
  gap20: {
    flexDirection: 'column',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vagueCircle: {
    position: 'absolute',
    backgroundColor: colors.DARK_LIGHT,
    top: -30,
    width: '100%',
    height: 200,
    borderRadius: 60,
    opacity: 0.1,
  },
  bottomCircle: {
    position: 'absolute',
    backgroundColor: colors.DARK_LIGHT,
    bottom: 40,
    left: -50,
    width: '60%',
    height: 300,
    borderRadius: 150,
    opacity: 0.09,
    transform: [{rotate: '130deg'}],
  },
  elavatedbg: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: Dimensions.get('window').height + 80,
    width: Dimensions.get('window').width,
    zIndex: 2000,
  },
  gestureStyle: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: '90%',
    zIndex: 3000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    height: 50,
    borderWidth: 1,
    paddingHorizontal: 20,
    width: '100%',
    borderRadius: 10,
    borderColor: colors.DARK_LIGHT,
    alignItems: 'center',
    gap: 10,
    zIndex: 1000,
  },
  textInput: {
    fontFamily: fonts.Vollkorn,
    alignItems: 'center',
    fontSize: 20,
    letterSpacing: 4,
    width: '100%',
  },
  label: {
    marginTop: 3,
    fontFamily: fonts.KarmaSemiBold,
    fontSize: 16,
  },
  sort: {
    borderWidth: 0,
    minHeight: 40,
    paddingHorizontal: 20,
    backgroundColor: colors.TRANPARENT,
    justifyContent: 'flex-start',
    zIndex: 100,
  },
});
export default Profile;
