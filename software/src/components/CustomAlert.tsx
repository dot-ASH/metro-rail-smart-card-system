import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import {colors} from '../style/colors';
import {fonts} from '../style/fonts';

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
      <View style={[styles.alert, {shadowColor: whichColor()}]}>
        <Text style={[styles.alertText]}>{text || 'Loading...'}</Text>
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
    backgroundColor: 'rgba(50, 46, 47, 0.6)',
  },
  alert: {
    // height: '70%',
    width: '80%',
    backgroundColor: colors.DARK_HIGHLIGHTED,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.DARK,
    elevation: 20,
    padding: 15,
  },
  alertText: {
    marginTop: 5,
    fontFamily: fonts.KarmaBold,
    fontSize: 14,
    color: colors.DARK,
  },
});

export default CustomAlert;
