/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useContext, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import {colors} from '../style/colors';
import {useUserInfo} from '../context/AuthContext';
import supabase from '../data/supaBaseClient';

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

type ScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'AuthStack'
>;

interface NavigationScreenProp {
  navigation: ScreenNavigationProp;
}

function Profile({navigation}: NavigationScreenProp): JSX.Element {
  const {darkMode, toggleOffDarkMode} = useContext(ThemeContext);
  const {user, setUsers} = useUserInfo();
  const [dialog, setDialog] = useState(false);
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

  const changePin = async (id: number, value: string) => {
    // setDialog(true);
    // const hashedPin = await sha256HashPin(value);
    // let {data, error} = await supabase
    //   .from('user')
    //   .update({verify_pin: hashedPin})
    //   .eq('id', 1);
    // if (error) {
    //   console.log(error);
    // } else {
    //   console.log(data);
    // }
  };

  const signout = async () => {
    const {error} = await supabase.auth.signOut();
    if (!error) {
      navigation.navigate('AuthStack');
    }
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.TRANPARENT}
        translucent={true}
      />
      <CustomDialog
        isVisible={dialog}
        title="hey"
        text="lh;ha;af"
        onCancle={() => setDialog(false)}
        onConfirm={() => console.log('okay')}
      />
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
            <View style={styles.gap15}>
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
              <View
                style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <Text style={[textStyle, styles.address]}>
                  {user[0].address || "you haven't set you address"}
                </Text>
                <TouchableOpacity>
                  <Feather
                    name="edit"
                    size={18}
                    style={[textStyle, {opacity: 0.8, elevation: 5}]}
                  />
                </TouchableOpacity>
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
              />
              <TouchableOpacity>
                <Text style={[textStyle, styles.itemName]}>Edit profile</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.menu}>
              <MaterialIcons
                name="circle-notifications"
                size={34}
                color={
                  isDarkMode ? colors.LIGHT_SHADE : colors.LIGHT_HIGHLIGHTED
                }
              />
              <TouchableOpacity>
                <Text style={[textStyle, styles.itemName]}>Notification</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.menu}>
              <Entypo
                name="flickr-with-circle"
                size={30}
                color={
                  isDarkMode ? colors.LIGHT_SHADE : colors.LIGHT_HIGHLIGHTED
                }
              />
              <TouchableOpacity>
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
              />
              <TouchableOpacity>
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
              />
              <TouchableOpacity onPress={signout}>
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
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  itemName: {
    fontFamily: fonts.KarmaBold,
    fontSize: 17,
    textAlign: 'left',
  },
  gap15: {
    flexDirection: 'column',
    gap: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Profile;
