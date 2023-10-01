/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {
  // LayoutAnimation,
  Platform,
  UIManager,
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {colors} from '../style/colors';
import {ThemeContext} from '../context/ThemeContext';
import {fonts} from '../style/fonts';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export interface TopBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  position: any;
}

const CustomTopBar = ({
  state,
  descriptors,
  navigation,
  position,
}: TopBarProps) => {
  const {darkMode} = useContext(ThemeContext);
  const isDarkMode = darkMode;
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.DARK : colors.LIGHT,
  };
  const textStyle = {
    color: isDarkMode ? colors.LIGHT_ALT : colors.DARK,
  };

  return (
    <View style={[styles.mainItemContainer, backgroundStyle]}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_: any, i: number) => i);
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map((i: number) => (i === index ? 1 : 0.3)),
        });

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.topBarStyle,
              {
                backgroundColor: isDarkMode
                  ? 'rgba(241, 234, 228, 0.1)'
                  : 'rgba(50, 46, 47, 0.2)',
              },
            ]}
            key={index}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                justifyContent: 'center',
              }}>
              {label === 'Trips' ? (
                <MaterialComIcon
                  name="led-strip-variant"
                  size={28}
                  color={
                    isDarkMode
                      ? colors.DARK_HIGHLIGHTED
                      : colors.LIGHT_HIGHLIGHTED
                  }
                />
              ) : (
                <MaterialIcon
                  name="history-toggle-off"
                  size={28}
                  color={
                    isDarkMode
                      ? colors.DARK_HIGHLIGHTED
                      : colors.LIGHT_HIGHLIGHTED
                  }
                />
              )}
              <Animated.Text style={[styles.barTitle, {opacity}, textStyle]}>
                {label}
              </Animated.Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  mainItemContainer: {
    flexDirection: 'row',
    paddingTop: 80,
    padding: 20,
  },
  topBarStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  barTitle: {
    fontSize: 16,
    fontFamily: fonts.Bree,
  },
});

export default CustomTopBar;
