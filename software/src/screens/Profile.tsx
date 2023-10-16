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

  const changePin = async (id: number, value: string) => {
    console.log('deHashed');
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

    const {error} = await supabase.auth.signOut();
    if (!error) {
      navigation.navigate('AuthStack');
    }
  };

  const test = () => {
    console.log('gasgssh');
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
        onConfirm={test}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[backgroundStyle, styles.screenContainer]}>
        {/* HEADER */}
        <View>
          <Text style={textStyle}>{user[0]?.user_data[0].verify_pin}</Text>
          <TouchableOpacity onPress={() => changePin(1, '100')}>
            <Text style={textStyle}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
});
export default Profile;
