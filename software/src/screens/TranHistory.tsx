/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useContext, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import {colors} from '../style/colors';
import CustomModal from '../components/modules/CustomModal';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function TranHistory({navigation}: any): JSX.Element {
  const {darkMode, toggleOffDarkMode} = useContext(ThemeContext);
  const [visible, setVisible] = useState<boolean>();
  const isDarkMode = darkMode;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.DARK : colors.LIGHT,
  };
  const textStyle = {
    color: isDarkMode ? colors.LIGHT_ALT : colors.DARK,
  };

  const textStyleAlt = {
    color: !isDarkMode ? colors.LIGHT_ALT : colors.DARK,
  };

  const modalNav = (e: any) => {
    e.preventDefault();
    navigation.push('module');
    // visible ? setVisible(false) : setVisible(true);
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={[backgroundStyle, styles.screenContainer]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={colors.TRANPARENT}
          translucent={true}
        />
        {/* {visible && <CustomModal />} */}
        <TouchableOpacity onPress={event => modalNav(event)}>
          <Text>gsuhsughsu</Text>
        </TouchableOpacity>

        {/* <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[backgroundStyle, styles.screenContainer]}>
        <Text style={{fontSize: 27, color: 'white'}}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestias
          itaque officia magni, sit reiciendis nesciunt quae quam sed! Porro,
          maiores odio! Itaque, veritatis dicta. Obcaecati, odit tempore cum
          corrupti non laborum soluta excepturi officia exercitationem expedita,
          velit vel, culpa natus sed voluptates nulla similique reprehenderit
          nobis! Soluta sed fugit molestias optio! Officiis
        </Text>
      </ScrollView> */}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flexDirection: 'column',
    height: Dimensions.get('window').height + 80,
    width: Dimensions.get('window').width,
    marginBottom: 100,
  },
});
export default TranHistory;
