/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {colors} from '../../style/colors';
import {ThemeContext} from '../../context/ThemeContext';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {fonts} from '../../style/fonts';
import {useNavigation} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import {useUserInfo} from '../../context/AuthContext';
import Entypo from 'react-native-vector-icons/Entypo';
import supabase from '../../data/supaBaseClient';
import Customloading from '../CustomLoading';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

interface StationDataProps {
  station_name: string;
  station_code: string;
  distance: number;
}

interface StationNameProps {
  label: string;
  value: string;
}

interface StationDataItemProps {
  name: string;
  distance: number;
  amount: number;
}

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const FareChart = () => {
  const navigaton = useNavigation();
  const {user } = useUserInfo();
  const {darkMode} = useContext(ThemeContext);
  const isDarkMode = darkMode;
  const defaultIndex = user[0].default_index;
  const [stationData, setStationData] = useState<StationDataProps[]>([]);
  const [stationName, setStationName] = useState<StationNameProps[]>([]);
  const [visible, setVisible] = useState<boolean>();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [sortValue, setSortValue] = useState(user[defaultIndex]?.address || '');

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

  const getStation = useCallback(async () => {
    const {data, error} = await supabase
      .from('station')
      .select('station_code, station_name, distance')
      .order('distance');
    if (!error) {
      setStationData(data);
    }
  }, []);

  useEffect(() => {
    getStation();
  }, [getStation]);

  useEffect(() => {
    if (stationData) {
      setLoading(false);
      let newStationName = stationData?.map(obj => {
        return {
          label: obj.station_name,
          value: obj.station_code,
        };
      });
      setStationName(newStationName);
    } else {
      setLoading(true);
    }
  }, [stationData]);

  const setPrice = (distance: number) => {
    if (distance < 4) {
      return 20;
    } else if (distance < 6.5) {
      return 30;
    } else if (distance < 9) {
      return 40;
    } else if (distance < 11) {
      return 50;
    } else if (distance < 13) {
      return 60;
    } else if (distance < 14) {
      return 70;
    } else if (distance < 16) {
      return 80;
    } else if (distance < 19) {
      return 90;
    } else {
      return 100;
    }
  };

  const setDataItems = (code: string) => {
    const whereAmI = stationData?.find(
      station => station.station_code === code,
    );
    let baseDistance: number = whereAmI?.distance || 0;

    let newStationName = stationData
      ?.filter(obj => obj.station_code !== code)
      .map(obj => {
        return {
          code: obj.station_code,
          name: obj.station_name,
          distance: Math.abs(baseDistance - obj.distance),
          amount: setPrice(Math.abs(baseDistance - obj.distance)),
        };
      });
    return newStationName.sort((a, b) => a.distance - b.distance);
  };

  const Item = ({name, amount, distance}: StationDataItemProps) => (
    <View style={[styles.history]}>
      <View
        style={[
          styles.historyIcon,
          {
            backgroundColor: isDarkMode
              ? 'rgba(241, 234, 228, 0.09)'
              : 'rgba(50, 46, 47, 0.09)',
            paddingHorizontal: 10,
          },
        ]}>
        <Text
          style={{
            color: isDarkMode ? colors.ERROR : '#c03d28',
            fontFamily: fonts.QuanticoBold,
          }}>
          {distance.toFixed(2)} km
        </Text>
      </View>
      <View style={styles.historyLabel}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <Text style={[textStyle, styles.label, {fontSize: 14}]}>{name}</Text>
        </View>
      </View>
      <View style={styles.historyDetails}>
        <Text style={[textStyle, styles.label]}>{amount} BDT</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <Customloading isVisible={isLoading} />
      <View
        style={[
          styles.moduleContainer,
          {
            backgroundColor: isDarkMode ? colors.DARK_SHADE : colors.LIGHT_ALT,
          },
        ]}>
        <View style={[styles.header]}>
          <TouchableOpacity
            style={styles.back}
            onPress={() => navigaton.goBack()}>
            <IonIcons
              name="chevron-back"
              size={28}
              color={colors.LIGHT_HIGHLIGHTED}
            />
          </TouchableOpacity>
          <Text style={[styles.moduleTitle, textStyle]}>Fare Chart</Text>
        </View>
        <View
          style={{
            height: '100%',
            width: '100%',
            flexDirection: 'column',
          }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              paddingHorizontal: 30,
              justifyContent: 'center',
            }}>
            <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
              <FontAwesome5Icon
                name="map-pin"
                color={colors.VERIFIED}
                size={20}
              />
              <Text
                style={[
                  textStyle,
                  {fontFamily: fonts.KarmaSemiBold, marginTop: 5},
                ]}>
                I am at
              </Text>
            </View>
            <View style={styles.sortContainer}>
              <DropDownPicker
                open={dropDownOpen}
                value={sortValue}
                items={stationName}
                setOpen={setDropDownOpen}
                setValue={setSortValue}
                setItems={setStationName}
                style={[
                  semiTransparent,
                  styles.sort,
                  {borderWidth: 0, minHeight: 40, paddingHorizontal: 20},
                ]}
                textStyle={[
                  textStyle,
                  {fontFamily: fonts.Vollkorn, fontSize: 16},
                ]}
                listItemLabelStyle={isDarkMode ? textStyle : textStyleAlt}
                placeholder={
                  user[defaultIndex]?.station?.station_name || 'unknown station'
                }
                placeholderStyle={[
                  textStyle,
                  {fontFamily: fonts.KarmaBold, marginTop: 5, fontSize: 14},
                ]}
                dropDownContainerStyle={{
                  backgroundColor: colors.DARK_LIGHT,
                  borderWidth: 0,
                  elevation: 10,
                  paddingHorizontal: 12,
                  paddingBottom: 15,
                  marginTop: 5,
                  paddingTop: 10,
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
          </View>
          {stationData.length > 0 ? (
            <View style={styles.historyContainer}>
              <FlatList
                data={setDataItems(sortValue)}
                renderItem={({item}) => (
                  <Item
                    name={item.name}
                    amount={item.amount}
                    distance={item.distance}
                  />
                )}
                keyExtractor={item => item.code}
              />
            </View>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                margin: 20,
              }}>
              <Text style={[textStyle, styles.label]}>
                Please set your nearest station
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: SCREEN_HEIGHT + 80,
  },
  moduleContainer: {
    height: '105%',
    width: '100%',
    top: '6%',
    borderRadius: 20,
    zIndex: 5000,
    elevation: 10,
    shadowColor: colors.DARK,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: "red",
  },
  header: {
    margin: 25,
    width: '90%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    paddingHorizontal: 10,
    opacity: 1,
  },
  moduleTitle: {
    fontFamily: fonts.Bree,
    fontSize: 18,
    flex: 0.9,
    textAlign: 'center',
    zIndex: 20,
  },
  back: {
    zIndex: 50,
    padding: 10,
  },
  sortContainer: {
    flex: 1,
  },
  sort: {borderWidth: 0, minHeight: 40, paddingHorizontal: 20},
  historyContainer: {
    marginTop: 5,
    paddingTop: 20,
    flexDirection: 'column',
    marginHorizontal: 20,
    borderRadius: 1,
    marginBottom: 280,
    opacity: 1,
    zIndex: 10000,
  },
  history: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.LIGHT_HIGHLIGHTED,
    marginBottom: 15,
    opacity: 1,
    zIndex: 15000,

  },
  historyIcon: {
    padding: 5,
    borderRadius: 10,
  },
  label: {
    fontFamily: fonts.KarmaBold,
    fontSize: 17,
  },
  // tranactionId: {
  //   fontFamily: fonts.Karma,
  //   fontSize: 12,
  //   opacity: 0.7,
  // },
  historyLabel: {flex: 1.7},
  historyDetails: {flex: 1, alignItems: 'flex-end'},
});

export default FareChart;
