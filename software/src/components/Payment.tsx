/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  UIManager,
  Linking,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {colors} from '../style/colors';
import {fonts} from '../style/fonts';
import Customloading from './CustomLoading';
import {TouchableOpacity} from 'react-native';
import {LayoutAnimation} from 'react-native';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {TextInput} from 'react-native';
import {Platform} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import {decryptHash} from '../security/encryp';
import {useUserInfo} from '../context/AuthContext';
import axios from 'axios';
import {LOCALHOST} from '@env';
import {HOST_SERVER} from '@env';
import Draggable from 'react-native-draggable';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type paymentProps = {
  onCancle: () => void;
};

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const Payment = ({onCancle}: paymentProps) => {
  const {darkMode} = useContext(ThemeContext);
  const {user, setUsers} = useUserInfo();
  const [ifLoading, setIfLoading] = useState(false);
  const [amountForm, setamountForm] = useState({
    newAmount: '',
  });
  const [balance, setBalance] = useState('');
  const [balanceStatus, setBalanceStatus] = useState('');

  const isDarkMode = darkMode;
  const defaultIndex = user[0]?.default_index;

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

  let currentBalance = parseInt(balance, 10);

  const semiTransparent = {
    backgroundColor: isDarkMode
      ? 'rgba(241, 234, 228, 0.1)'
      : 'rgba(50, 46, 47, 0.2)',
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err =>
      console.error('Error opening link: ', err),
    );
  };

  const getAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: {type: 'easeIn', property: 'opacity'},
    });
  };

  const onChangeAmountHandler = (value: string, name: string) => {
    setamountForm((form: any) => ({
      ...form,
      [name]: value,
    }));
  };

  const handlePayment = async () => {
    setIfLoading(true);
    const url = `${HOST_SERVER}/payment-request`;
    let amountToRchrg = parseInt(amountForm.newAmount, 10);

    var myHeaders = {
      'Content-Type': 'application/json',
    };

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      url: url,
      data: {
        curr_bal: currentBalance,
        amount: amountToRchrg,
        user_index: user[0].user_data[0].user_index,
      },
    };
    axios
      .request(requestOptions)
      .then(response => {
        setIfLoading(false);
        if (response.data.url) {
          console.log(response.data.url);
          openLink(response.data.url);
        }
        setamountForm({newAmount: ''});
      })
      .catch(error => console.log('error', error));
  };

  const decryptBalance = async (input: string) => {
    if (typeof input !== 'undefined') {
      setBalance(await decryptHash(input));
    }
  };

  const getBalanceStatus = async () => {
    if (typeof currentBalance === 'number') {
      if (currentBalance >= 500) {
        setBalanceStatus('good amount of');
      } else if (currentBalance >= 200) {
        setBalanceStatus('sufficient');
      } else if (currentBalance >= 100) {
        setBalanceStatus('low');
      } else {
        setBalanceStatus('no');
      }
    }
  };

  useEffect(() => {
    decryptBalance(user[defaultIndex]?.user_data[0].balance);
    getBalanceStatus();
  });

  return (
    <View>
      <View style={styles.paymentStyle}>
        <Draggable
          x={SCREEN_WIDTH / 2 - (SCREEN_WIDTH - 20) / 2}
          y={SCREEN_HEIGHT / 4}
          touchableOpacityProps={{activeOpacity: 1}}>
          <View
            style={[
              backgroundStyle,
              {
                width: SCREEN_WIDTH - 20,
                borderRadius: 20,
                elevation: 20,
                padding: 20,
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
              <FontAwesome6Icon
                name="coins"
                size={22}
                color={
                  isDarkMode
                    ? colors.DARK_HIGHLIGHTED
                    : colors.LIGHT_HIGHLIGHTED
                }
              />
              <Text
                style={[
                  textStyle,
                  {
                    textAlign: 'center',
                    fontFamily: fonts.Bree,
                    fontSize: 18,
                  },
                ]}>
                Recharge your card
              </Text>
              <TouchableOpacity onPress={onCancle} style={{paddingLeft: 40}}>
                <FontAwesome6Icon size={20} name="xmark" style={[textStyle]} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                paddingVertical: 15,
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '100%',
                gap: 15,
                marginTop: 20,
              }}>
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderWidth: 0,
                    width: '90%',
                    height: 'auto',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  },
                ]}>
                <Text style={[textStyle, styles.label]}>You have</Text>
                <Text
                  style={[
                    styles.balanceStyle,
                    semiTransparent,
                    {
                      color:
                        balanceStatus === 'low' || balanceStatus === 'no'
                          ? colors.ERROR
                          : balanceStatus === 'sufficient'
                          ? colors.WARNING
                          : colors.VERIFIED,
                    },
                  ]}>
                  {balanceStatus}
                </Text>
                <Text style={[textStyle, styles.label]}>balance.</Text>
                {balanceStatus === 'no' ? (
                  <Text
                    style={[
                      textStyle,
                      styles.label,
                      {color: colors.ERROR, fontFamily: fonts.KarmaBold},
                    ]}>
                    recharge immediately.
                  </Text>
                ) : null}
                <Text style={[textStyle, styles.label, {opacity: 0.6}]}>
                  you can recharge here.
                </Text>
              </View>
              <View style={[styles.inputContainer, {width: '80%'}]}>
                <Text style={[textStyle, styles.label]}>Amount:</Text>
                <TextInput
                  style={[textStyle, styles.textInput]}
                  value={amountForm.newAmount}
                  onChangeText={value =>
                    onChangeAmountHandler(value, 'newAmount')
                  }
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
                onPress={handlePayment}>
                <Text style={[styles.label, textStyleAlt]}>Recharge</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Draggable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  paymentStyle: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('screen').height,
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
    justifyContent: 'center',
  },
  label: {
    marginTop: 3,
    fontFamily: fonts.KarmaSemiBold,
    fontSize: 16,
  },
  balanceStyle: {
    paddingHorizontal: 7,
    paddingTop: 4,
    fontFamily: fonts.KarmaSemiBold,
    fontSize: 16,
    borderRadius: 5,
  },
});

export default Payment;
