/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {
  LayoutAnimation,
  Platform,
  UIManager,
  View,
  // Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {colors} from '../style/colors';
import NavigationIcon from './navigationIcon';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {ThemeContext} from '../context/ThemeContext';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const {width} = Dimensions.get('window');

export interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const TabBar = ({state, descriptors, navigation}: TabBarProps) => {
  const {darkMode} = useContext(ThemeContext);
  const isDarkMode = darkMode;
  const [hover, setHover] = useState(false);
  const animateHover = () => {
    LayoutAnimation.configureNext({
      duration: 500,
      create: {type: 'linear', property: 'opacity'},
      update: {type: 'spring', springDamping: 0.4},
      delete: {type: 'linear', property: 'opacity'},
    });
    setHover(hover ? false : true);
  };
  // useEffect(() => {
  //   console.log(isDarkMode ? 'dark' : 'light');
  // }, [isDarkMode]);
  return (
    <View
      style={[
        styles.mainContainer,
        {
          backgroundColor: isDarkMode ? colors.DARK_ALT : '#f5efea',
          zIndex: 4000,
        },
      ]}>
      {state.routes.map((route: any, index: any) => {
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

        return (
          <View style={styles.mainItemContainer} key={index}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{flex: 1}}>
              <View>
                {!isDarkMode ? (
                  <NavigationIcon
                    route={label}
                    isFocused={isFocused}
                    colorCode={isFocused ? colors.DARK : colors.DARK_LIGHT}
                  />
                ) : (
                  <NavigationIcon
                    route={label}
                    isFocused={isFocused}
                    colorCode={isFocused ? colors.LIGHT : colors.DARK_LIGHT}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
      <View
        style={[
          styles.rechargeBtn,
          {
            backgroundColor: isDarkMode
              ? colors.DARK_HIGHLIGHTED
              : colors.LIGHT_HIGHLIGHTED,
          },
        ]}>
        <FontAwesome6Icon
          name="coins"
          size={30}
          color={isDarkMode ? colors.DARK_ALT : colors.LIGHT_ALT}
          style={hover ? [styles.recharge, styles.hoverStyle] : styles.recharge}
          onPress={animateHover}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    width: width,
    elevation: 10,
    paddingLeft: 5,
    zIndex: 4000,
  },
  mainItemContainer: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    marginRight: -10,
  },
  rechargeBtn: {
    position: 'absolute',
    right: 40,
    bottom: 45,
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    transform: [{rotate: '45deg'}],
    elevation: 5,
    shadowColor: '#69625d',
  },
  hoverStyle: {
    transform: [{rotate: '135deg'}],
  },
  recharge: {
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{rotate: '-45deg'}],
  },
});

export default TabBar;
