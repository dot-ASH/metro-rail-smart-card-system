import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import {colors} from '../style/colors';
import {ActivityIndicator} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';

type CustomloadingProps = {
  isVisible: boolean;
  text?: string;
  status?: string;
};

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Customloading = ({isVisible}: CustomloadingProps): JSX.Element => {
  const [top, setTop] = useState<number>(-100);
  const [opacity, setOpacity] = useState<number>(0);
  const {darkMode} = useContext(ThemeContext);
  const isDarkMode = darkMode;

  const toggleLoading = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (isVisible) {
      setTop(50);
      setOpacity(1);
    } else {
      setTop(-100);
      setOpacity(0);
    }
  };

  useEffect(() => {
    toggleLoading();
  });

  return (
    <View style={[styles.loadingBox, {top: top, opacity: opacity}]}>
      <View
        style={[
          styles.loading,
          {
            shadowColor: colors.DARK,
            backgroundColor: isDarkMode
              ? colors.LIGHT_SHADE
              : colors.DARK_SHADE,
          },
        ]}>
        <ActivityIndicator
          size={25}
          color={isDarkMode ? colors.DARK : colors.LIGHT}
          animating={isVisible}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingBox: {
    position: 'absolute',
    height: 80,
    width: '100%',
    zIndex: 100,
    justifyContent: 'flex-start',
    alignItems: 'center',
    elevation: 10,
  },
  loading: {
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.DARK,
    elevation: 20,
    padding: 5,
  },
  loadingIndicator: {},
});

export default Customloading;
