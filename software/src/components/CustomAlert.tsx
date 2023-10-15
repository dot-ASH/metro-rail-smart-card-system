import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import {colors} from '../style/colors';
import {fonts} from '../style/fonts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type CustomAlertProps = {
  isVisible: boolean;
  text?: string | null;
  status?: string;
};

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const CustomAlert = ({
  isVisible,
  text,
  status,
}: CustomAlertProps): JSX.Element => {
  const [top, setTop] = useState<number>();
  const {darkMode} = useContext(ThemeContext);
  const isDarkMode = darkMode;

  const toggleAlert = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (isVisible) {
      setTop(50);
    } else {
      setTop(-100);
    }
  };

  useEffect(() => {
    toggleAlert();
  });

  const whichColor = () => {
    let color;
    switch (status) {
      case 'success':
        color = colors.VERIFIED;
        break;
      case 'error':
        color = colors.ERROR;
        break;
      default:
        color = colors.DARK;
    }
    return color;
  };

  return (
    <View style={[styles.alertBox, {top: top}]}>
      <View
        style={[
          styles.alert,
          {
            backgroundColor: isDarkMode
              ? colors.LIGHT_SHADE
              : colors.DARK_SHADE,
            shadowColor: whichColor(),
          },
        ]}>
        <MaterialIcons
          name="report-gmailerrorred"
          size={20}
          color={isDarkMode ? colors.DARK : colors.LIGHT}
        />
        <Text
          style={[
            styles.alertText,
            {color: isDarkMode ? colors.DARK : colors.LIGHT},
          ]}>
          {text || 'Loading...'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alertBox: {
    position: 'absolute',
    minheight: 80,
    width: '100%',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alert: {
    width: '85%',
    borderRadius: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
    padding: 15,
    gap: 10,
  },
  alertText: {
    marginTop: 5,
    fontFamily: fonts.KarmaBold,
    fontSize: 15,
  },
});

export default CustomAlert;
