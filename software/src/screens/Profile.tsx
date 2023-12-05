/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  LayoutAnimation,
  Linking,
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
import { ThemeContext } from '../context/ThemeContext';
import { colors } from '../style/colors';
import { useUserInfo } from '../context/AuthContext';
import supabase from '../data/supaBaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../components/CustomAlert';
import Customloading from '../components/CustomLoading';
import CustomDialog from '../components/CustomDialog';
import { sha256HashPin } from '../security/encryp';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainStack';
import Feather from 'react-native-vector-icons/Feather';
import { fonts } from '../style/fonts';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import Draggable from 'react-native-draggable';
import DropDownPicker from 'react-native-dropdown-picker';
import { REG_URL } from '@env';
import { Switch } from 'react-native-switch';

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

interface DropDownProps {
  label: string;
  value: string | number;
}

const PASS_REGEX = /^\d{5}$/;
const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

function Profile({ navigation }: NavigationScreenProp): JSX.Element {
  const { darkMode } = useContext(ThemeContext);
  const { user, refreshModule } = useUserInfo();
  const userIndex = user[0]?.default_index;
  const [dialog, setDialog] = useState(false);
  const [alert, setAlert] = useState('');
  const [elavatedBg, setElavatedBg] = useState(false);
  const [addrModule, setAddrModule] = useState(false);
  const [accModule, setAccModule] = useState(false);
  const [ifLoading, setIfLoading] = useState(false);
  const [ifSuccess, setIfSuccess] = useState(false);
  const [ifWrong, setIfWrong] = useState(false);
  const [psModule, setPassModule] = useState(false);
  const [editModule, setEditModule] = useState(false);
  const [settingModule, setSettingModule] = useState(false);
  const [pushNoti, setPushNoti] = useState(false);
  const [stationData, setStationData] = useState<StationDataProps[]>();
  const [stationName, setStationName] = useState<DropDownProps[]>([]);
  const [userName, setUserName] = useState<DropDownProps[]>([]);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [userSwitchOpen, setUserSwitchOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [sortValue, setSortValue] = useState('');
  const [userValue, setUserValue] = useState(userIndex);

  const [passForm, setPassForm] = useState({
    newPass: '',
    confirmPass: '',
  });

  const [editForm, setEditForm] = useState({
    newName: '',
    newEmail: '',
  });

  const [dialogInfo, setDialogInfo] = useState({
    title: '',
    text: '',
    onConfirm: () => { },
  });

  const isDarkMode = darkMode;
  const defaultIndex = user[0].default_index;

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
      console.log('getStorage:', error);
    }
  };

  const setStorageValue = async (valueName: string, value: string) => {
    try {
      await AsyncStorage.setItem(valueName, value);
    } catch (error: any) {
      console.log('setStorage:', error);
    }
  };

  const setAlertText = (text: string) => {
    setAlert(text);
    setTimeout(() => {
      setAlert('');
    }, 6000);
  };

  const getAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: { type: 'easeIn', property: 'opacity' },
    });
  };

  const clearCustoms = () => {
    setAlert('');
    setIfLoading(false);
    setIfSuccess(false);
    setIfWrong(false);
  };

  const onChangePassHandler = (value: string, name: string) => {
    setPassForm(form => ({
      ...form,
      [name]: value,
    }));
  };

  const onChangeEditHandler = (value: string, name: string) => {
    setEditForm(form => ({
      ...form,
      [name]: value,
    }));
  };

  useEffect(() => {
    getStorageValue();
  }, []);

  /*   console.log(pushNoti); */

  const getStation = useCallback(async () => {
    const { data, error } = await supabase
      .from('station')
      .select('station_code, station_name, distance')
      .order('distance');
    if (!error) {
      setStationData(data);
    }
  }, []);

  const updateUser = useCallback(async () => {
    if (sortValue && sortValue !== user[defaultIndex]?.address) {
      const { error } = await supabase
        .from('user')
        .update({ address: sortValue })
        .eq('id', user[defaultIndex]?.id);
    }
  }, [defaultIndex, sortValue, user]);

  const switchId = async (value: any) => {
    setLoading(true);
    const { data } = await supabase.auth.getSession();
    const response = data?.session?.user.phone
      ? await supabase
        .from('user')
        .update({ default_index: value.value })
        .eq('phn_no', data?.session?.user.phone)
      : await supabase
        .from('user')
        .update({ default_index: value.value })
        .eq('email', data?.session?.user.email);
    if (response.error) {
      console.log('switching', response.error.message);
    } else {
      refreshModule();
      setLoading(false)
    }
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

  useEffect(() => {
    if (user) {
      setLoading(false);
      let newUser = user?.map((obj, index) => {
        return {
          label: obj.name,
          value: index,
        };
      });
      setUserName(newUser);
    } else {
      setLoading(true);
    }
  }, [user]);

  const editProfile = async () => {
    clearCustoms();
    let errorLog = '';
    editForm.newName === '' && editForm.newEmail === ''
      ? (errorLog = "You haven't made any changes")
      : null;

    if (!errorLog) {
      setIfLoading(true);
      if (editForm.newName) {
        const { error } = await supabase
          .from('user')
          .update({ name: editForm.newName })
          .eq('id', user[defaultIndex]?.id);
        error ? (errorLog = 'Somethings wrong! try again') : null;
      } else if (editForm.newEmail) {
        const { error } = await supabase
          .from('user')
          .update({ email: editForm.newEmail })
          .eq('id', user[defaultIndex]?.id);
        error ? (errorLog = 'Somethings wrong! try again') : null;
      }
      setIfLoading(false);
      setAlertText('Your profile has been edited');
    } else {
      setIfLoading(false);
      setAlertText(errorLog);
    }
  };

  const applyReg = () => {
    const regUrl = REG_URL;
    Linking.openURL(regUrl).catch(err =>
      console.error('Error opening link: ', err),
    );
  };

  const changePin = async () => {
    clearCustoms();
    let errorLog = '';
    passForm.newPass !== passForm.confirmPass
      ? (errorLog = "PIN doesn't match")
      : !PASS_REGEX.test(passForm.newPass)
        ? (errorLog = 'Enter a valid five number PIN')
        : null;

    if (errorLog) {
      setAlertText(errorLog);
    } else {
      setIfLoading(true);
      const hashedpPIN = await sha256HashPin(passForm.newPass);
      const { error } = await supabase
        .from('user_data')
        .update({ verify_pin: hashedpPIN })
        .eq('phn_no', user[defaultIndex]?.phn_no);
      if (error) {
        setIfLoading(false);
        setAlertText('Somethings wrong! try again');
      } else {
        setIfLoading(false);
        setAlertText('Your PIN has been changed');
      }
    }
  };

  const signout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setDialog(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'AuthStack' }],
      });

      navigation.navigate('AuthStack');
    }
  };

  const handlePushNoti = () => {
    if (pushNoti) {
      setPushNoti(false);
      setStorageValue('pushNotiValue', 'false');
    } else {
      setPushNoti(true);
      setStorageValue('pushNotiValue', 'true');
    }
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.TRANPARENT}
        translucent={true}
      />
      {elavatedBg ? <View style={styles.elavatedbg} /> : null}
      <Customloading isVisible={isLoading} />
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
            touchableOpacityProps={{ activeOpacity: 1 }}>
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
                  style={{ padding: 10, alignSelf: 'flex-end' }}>
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
                <View
                  style={[
                    styles.inputContainer,
                    { width: '80%', paddingHorizontal: 20, gap: 10 },
                  ]}>
                  <Text style={[textStyle, styles.label]}>New PIN: </Text>
                  <TextInput
                    style={[
                      textStyle,
                      styles.textInput,
                      { fontSize: 20, letterSpacing: 4 },
                    ]}
                    value={passForm.newPass}
                    onChangeText={value =>
                      onChangePassHandler(value, 'newPass')
                    }
                    secureTextEntry={true}
                  />
                </View>

                <View style={[styles.inputContainer, { width: '80%' }]}>
                  <Text style={[textStyle, styles.label]}>Confirm PIN: </Text>
                  <TextInput
                    style={[
                      textStyle,
                      styles.textInput,
                      { fontSize: 20, letterSpacing: 4 },
                    ]}

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

      {/* EDIT PROFILE */}
      {editModule ? (
        <View style={styles.gestureStyle}>
          <Draggable
            x={SCREEN_WIDTH / 2 - (SCREEN_WIDTH - 40) / 2}
            y={SCREEN_HEIGHT / 3}
            touchableOpacityProps={{ activeOpacity: 1 }}>
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
                  Edit Profile Info
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    getAnimation();
                    clearCustoms();
                    setEditModule(false);
                    setElavatedBg(false);
                  }}
                  style={{ padding: 10, alignSelf: 'flex-end' }}>
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
                <View style={[styles.inputContainer, { width: '80%' }]}>
                  <Text style={[textStyle, styles.label]}>Name: </Text>
                  <TextInput
                    style={[textStyle, styles.textInput]}
                    value={editForm.newName}
                    onChangeText={value =>
                      onChangeEditHandler(value, 'newName')
                    }
                    placeholder={user[defaultIndex].name}
                    placeholderTextColor={isDarkMode ? colors.LIGHT_ALT : colors.DARK}
                  />
                </View>

                <View style={[styles.inputContainer, { width: '80%' }]}>
                  <Text style={[textStyle, styles.label]}>Email: </Text>
                  <TextInput
                    style={[textStyle, styles.textInput]}
                    value={editForm.newEmail}
                    onChangeText={value =>
                      onChangeEditHandler(value, 'newEmail')
                    }
                    placeholder={user[defaultIndex].email}
                    placeholderTextColor={isDarkMode ? colors.LIGHT_ALT : colors.DARK}

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
                  onPress={editProfile}>
                  <Text style={[styles.label, textStyleAlt]}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Draggable>
        </View>
      ) : null}

      {/* SETTINGS */}
      {settingModule ? (
        <View style={styles.gestureStyle}>
          <Draggable
            x={SCREEN_WIDTH / 2 - (SCREEN_WIDTH - 40) / 2}
            y={SCREEN_HEIGHT / 3}
            touchableOpacityProps={{ activeOpacity: 1 }}>
            <View
              style={[
                backgroundStyle,
                {
                  width: SCREEN_WIDTH - 40,
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
                  style={{ padding: 10, alignSelf: 'flex-end' }}>
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
                    Push Notification
                  </Text>
                  <Switch
                    onValueChange={handlePushNoti}
                    value={pushNoti}
                    circleSize={20}
                    barHeight={25}
                    backgroundActive={isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}
                    backgroundInactive={isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.4)'}
                    circleActiveColor={isDarkMode ? colors.LIGHT : colors.DARK}
                    circleInActiveColor={isDarkMode ? colors.DARK : colors.LIGHT}
                    changeValueImmediately={true}                    
                    innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} 
                    outerCircleStyle={{}} 
                    renderActiveText={false}
                    renderInActiveText={false}
                    switchLeftPx={2} 
                    switchRightPx={2} 
                    switchWidthMultiplier={2} 
                    switchBorderRadius={30}
                  />
                </View>
              </View>
            </View>
          </Draggable>
        </View>
      ) : null}

      {/* PROFILE PAGE */}
      <View style={styles.vagueCircle} />
      <View style={[styles.bottomCircle]} />
      <View style={styles.screenContainer}>
        <View style={styles.profileConatiner}>
          <View style={styles.profileDp}>
            <View style={styles.dp}>
              <FontAwesome5Icon
                name={defaultIndex === 0 ? 'user-astronaut' : 'user-graduate'}
                size={84}
                color={colors.DARK}
              />
            </View>
            <View style={styles.gap20}>
              <View>
                {user.length < 2 ? (
                  <Text style={[styles.name, textStyle]}>
                    {user[defaultIndex]?.name}
                  </Text>
                ) : (
                  <DropDownPicker
                    open={userSwitchOpen}
                    value={userValue}
                    items={userName}
                    setOpen={setUserSwitchOpen}
                    setValue={setUserValue}
                    setItems={setUserName}
                    style={styles.sort}
                    textStyle={[textStyle, { textAlign: 'right', flex: 0 }]}
                    listItemLabelStyle={textStyle}
                    placeholder={user[defaultIndex]?.name}
                    placeholderStyle={[textStyle, styles.name]}
                    labelStyle={[textStyle, styles.name]}
                    dropDownContainerStyle={{
                      backgroundColor: isDarkMode ? '#3B3637' : '#E7E0DB',
                      borderWidth: 0,
                      elevation: 10,
                      paddingHorizontal: 12,
                      paddingBottom: 15,
                      paddingTop: 10,
                      borderRadius: 10,
                      maxWidth: 250,
                      justifyContent: 'center',
                      flex: 0,
                      alignSelf: 'center',
                    }}
                    showTickIcon={true}
                    ArrowDownIconComponent={() => (
                      <Entypo name="chevron-down" size={16} style={textStyle} />
                    )}
                    ArrowUpIconComponent={() => (
                      <Entypo name="chevron-up" size={16} style={textStyle} />
                    )}
                    TickIconComponent={() => (
                      <Entypo name="check" size={16} style={textStyle} />
                    )}
                    scrollViewProps={{ endFillColor: 'black' }}
                    loading={isLoading}
                    onSelectItem={value => switchId(value)}
                  />
                )}
              </View>
              <Text
                style={[
                  textStyle,
                  styles.address,
                  semiTransparent,
                  { borderRadius: 5, paddingHorizontal: 10, paddingBottom: 3 },
                ]}>
                +{user[defaultIndex]?.phn_no}
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
                  textStyle={[textStyle, { textAlign: 'right', flex: 0 }]}
                  listItemLabelStyle={textStyle}
                  placeholder={
                    user[defaultIndex]?.station.station_name ||
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
                    maxWidth: 250,
                    justifyContent: 'center',
                    flex: 0,
                    alignSelf: 'center',
                  }}
                  showTickIcon={true}
                  ArrowDownIconComponent={() => (
                    <Feather
                      name="edit"
                      size={18}
                      style={[textStyle, { opacity: 0.8, elevation: 5 }]}
                    />
                  )}
                  ArrowUpIconComponent={({ style }) => (
                    <Entypo name="chevron-up" size={16} style={textStyle} />
                  )}
                  TickIconComponent={({ style }) => (
                    <Entypo name="check" size={16} style={textStyle} />
                  )}
                  scrollViewProps={{ endFillColor: 'black' }}
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
                style={{ flex: 0.65, textAlign: 'right' }}
              />
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  getAnimation();
                  setElavatedBg(true);
                  setEditModule(true);
                }}>
                <Text style={[textStyle, styles.itemName]}>Edit profile</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.menu}>
              <MaterialIcons
                name="add-circle"
                size={34}
                color={
                  isDarkMode ? colors.LIGHT_SHADE : colors.LIGHT_HIGHLIGHTED
                }
                style={{ flex: 0.65, textAlign: 'right' }}
              />
              <TouchableOpacity style={{ flex: 1 }} onPress={applyReg}>
                <Text style={[textStyle, styles.itemName]}>Add Account</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.menu}>
              <Entypo
                name="flickr-with-circle"
                size={30}
                color={
                  isDarkMode ? colors.LIGHT_SHADE : colors.LIGHT_HIGHLIGHTED
                }
                style={{ flex: 0.65, textAlign: 'right' }}
              />
              <TouchableOpacity
                style={{ flex: 1 }}
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
                style={{ flex: 0.65, textAlign: 'right' }}
              />
              <TouchableOpacity
                style={{ flex: 1 }}
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
                style={{ flex: 0.65, textAlign: 'right' }}
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
                style={{ flex: 1 }}>
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
    /*     position: 'relative', */
    width: 130,
    aspectRatio: 0.9,
    borderRadius: 100,
    backgroundColor: colors.DARK_LIGHT,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 30,
  },
  menu: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 45,
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
    transform: [{ rotate: '130deg' }],
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
    minHeight: 50,
    borderWidth: 1,
    paddingHorizontal: 15,
    width: '100%',
    borderRadius: 10,
    borderColor: colors.DARK_LIGHT,
    alignItems: 'center',
    gap: 5,
    zIndex: 1000,
    overflow: 'scroll',
  },
  textInput: {
    fontFamily: fonts.Vollkorn,
    fontSize: 14,
    alignItems: 'center',
    width: '100%',
  },

  upload: {
    position: 'absolute',
    bottom: '5%',
    alignSelf: 'center',
    zIndex: 1500,
  },

  label: {
    marginTop: 3,
    fontFamily: fonts.KarmaSemiBold,
    fontSize: 15,
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
