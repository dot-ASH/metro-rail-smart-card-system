/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import {View} from 'react-native';

// import Fontawesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import MaterialIconCom from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface NavigationIconProps {
  route: string;
  isFocused: boolean;
  colorCode: string;
}

const NavigationIcon = ({route, isFocused, colorCode}: NavigationIconProps) => {
  const renderIcon = (route: string, isFocues: boolean, colorCode: string) => {
    switch (route) {
      case 'Home':
        // return <Fontawesome6 name="house-lock" size={26} color={colorCode} />;
        return (
          <MaterialIconCom
            name="checkbox-multiple-blank-circle"
            size={32}
            color={colorCode}
          />
        );
      case 'History':
        return (
          <MaterialIcon name="featured-play-list" size={32} color={colorCode} />
        );
      case 'Profile':
        return <Fontawesome name="user" size={32} color={colorCode} />;
      default:
        break;
    }
  };

  return <View>{renderIcon(route, isFocused, colorCode)}</View>;
};

export default NavigationIcon;
