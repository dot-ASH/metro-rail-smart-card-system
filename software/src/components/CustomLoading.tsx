import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import {colors} from '../style/colors';
import {ActivityIndicator} from 'react-native';

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
  const [top, setTop] = useState<number>();

  const toggleLoading = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (isVisible) {
      setTop(50);
    } else {
      setTop(-100);
    }
  };

  useEffect(() => {
    toggleLoading();
  });

  return (
    <View style={[styles.loadingBox, {top: top}]}>
      <View style={[styles.loading, {shadowColor: colors.DARK}]}>
        <ActivityIndicator
          size={25}
          color={colors.DARK}
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
    backgroundColor: 'rgba(50, 46, 47, 0.6)',
  },
  loading: {
    // height: 30,
    // aspectRatio: 1,
    backgroundColor: colors.DARK_HIGHLIGHTED,
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
