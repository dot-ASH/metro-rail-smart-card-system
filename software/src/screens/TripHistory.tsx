/* eslint-disable react/no-unstable-nested-components */
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
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {colors} from '../style/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import Entypo from 'react-native-vector-icons/Entypo';
import {fonts} from '../style/fonts';

function TripHistory(): JSX.Element {
  const {darkMode, toggleOffDarkMode} = useContext(ThemeContext);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Sorted by recent', value: 'apple'},
    {label: 'Sorted by high amount', value: 'banana'},
  ]);
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

  const semiTransparent = {
    backgroundColor: isDarkMode
      ? 'rgba(241, 234, 228, 0.1)'
      : 'rgba(50, 46, 47, 0.2)',
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={[backgroundStyle, styles.screenContainer]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={colors.TRANPARENT}
          translucent={true}
        />
        <View style={styles.sortContainer}>
          <DropDownPicker
            open={dropDownOpen}
            value={sortValue}
            items={items}
            setOpen={setDropDownOpen}
            setValue={setSortValue}
            setItems={setItems}
            style={[
              semiTransparent,
              styles.sort,
              {borderWidth: 0, minHeight: 40, paddingHorizontal: 20},
            ]}
            textStyle={textStyle}
            listItemLabelStyle={isDarkMode ? textStyle : textStyleAlt}
            placeholder={'Sorted by default'}
            placeholderStyle={textStyle}
            dropDownContainerStyle={{
              backgroundColor: colors.LIGHT_HIGHLIGHTED,
              borderWidth: 0,
              elevation: 10,
              paddingHorizontal: 12,
            }}
            showTickIcon={true}
            activityIndicatorColor={'white'}
            ArrowDownIconComponent={() => (
              <Entypo name="chevron-down" size={16} style={textStyle} />
            )}
            ArrowUpIconComponent={({style}) => (
              <Entypo name="chevron-up" size={16} style={textStyle} />
            )}
            TickIconComponent={({style}) => (
              <Entypo name="check" size={16} style={textStyle} />
            )}
          />
        </View>
        {/* {visible && <CustomModal />} */}
        {/* <TouchableOpacity onPress={event => modalNav(event)}>
        <Text>gsuhsughsu</Text>
      </TouchableOpacity> */}

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={[backgroundStyle, styles.screenContainer]}>
          <View style={styles.historyContainer}>
            <View style={[styles.history]}>
              <Entypo
                name="line-graph"
                size={18}
                color={colors.DARK}
                style={[styles.historyIcon, {backgroundColor: colors.ERROR}]}
              />
              <View style={styles.historyLabel}>
                <Text style={[textStyle, styles.label]}>Mirpur 10</Text>
                <Text style={[textStyle, styles.tranactionId]}>
                  #2794722367
                </Text>
              </View>
              <View style={styles.historyDetails}>
                <Text style={[textStyle, styles.label]}>+300</Text>
                <Text style={[textStyle, styles.tranactionId]}>12.07.2023</Text>
              </View>
            </View>
            <View style={[styles.history]}>
              <Entypo
                name="line-graph"
                size={18}
                color={colors.LIGHT_ALT}
                style={[styles.historyIcon, {backgroundColor: colors.ERROR}]}
              />
              <View style={styles.historyLabel}>
                <Text style={[textStyle, styles.label]}>Mirpur 12</Text>
                <Text style={[textStyle, styles.tranactionId]}>
                  #2794722379
                </Text>
              </View>
              <View style={styles.historyDetails}>
                <Text style={[textStyle, styles.label]}>+300</Text>
                <Text style={[textStyle, styles.tranactionId]}>12.07.2023</Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
  sortContainer: {
    margin: 10,
    marginHorizontal: 25,
  },
  sort: {borderWidth: 0, minHeight: 40, paddingHorizontal: 20},
  historyContainer: {
    marginTop: 5,
    paddingTop: 15,
    flexDirection: 'column',
    marginHorizontal: 25,
    gap: 10,
    borderTopWidth: 0.5,
    borderColor: colors.LIGHT_HIGHLIGHTED,
    borderStyle: 'dashed',
    borderRadius: 1,
  },
  history: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 20,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.LIGHT_HIGHLIGHTED,
  },
  historyIcon: {
    padding: 5,
    borderRadius: 10,
  },
  label: {
    fontFamily: fonts.KarmaBold,
    fontSize: 17,
  },
  tranactionId: {
    fontFamily: fonts.Karma,
    fontSize: 14,
    opacity: 0.7,
  },
  historyLabel: {flex: 0.5},
  historyDetails: {flex: 0.4, alignItems: 'flex-end'},
});
export default TripHistory;
