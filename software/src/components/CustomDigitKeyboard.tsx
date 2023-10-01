import React, {useContext} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import {colors} from '../style/colors';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {fonts} from '../style/fonts';

interface CustomDigitKeyboardProps {
  onKeyPress: (key: string) => void;
  onCancleKeyPress: () => void;
}

const CustomDigitKeyboard: React.FC<CustomDigitKeyboardProps> = ({
  onKeyPress,
  onCancleKeyPress,
}) => {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const {darkMode} = useContext(ThemeContext);
  const isDarkMode = darkMode;

  const handleKeyPress = (key: string) => {
    onKeyPress(key);
  };

  return (
    <View style={styles.container}>
      {digits.map(digit => (
        <TouchableOpacity
          key={digit}
          onPress={() => handleKeyPress(digit)}
          style={styles.button}>
          <Text
            style={[
              styles.buttonText,
              {color: isDarkMode ? colors.DARK : colors.LIGHT},
            ]}>
            {digit}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={onCancleKeyPress} style={styles.backIcon}>
        <IonIcon
          name="backspace"
          size={28}
          color={isDarkMode ? colors.DARK : colors.LIGHT}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    marginBottom: 40,
  },
  button: {
    width: '20%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 26,
    fontFamily: fonts.SourceCodeProBold,
  },
  backIcon: {
    bottom: 11,
    right: 35,
    position: 'absolute',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomDigitKeyboard;
