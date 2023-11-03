/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback, useContext, useEffect, useState} from 'react';
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
  FlatList,
} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {colors} from '../style/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import Entypo from 'react-native-vector-icons/Entypo';
import {fonts} from '../style/fonts';
import {useUserInfo} from '../context/AuthContext';
import supabase from '../data/supaBaseClient';
import moment from 'moment';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';

// interface stationData {
//   station_name: string;
//   distance: string;
// }

interface TripDataProps {
  id: number;
  transId: string;
  amount: string;
  station_code_to: {station_name: string};
  station_code_from: {station_name: string};
  created_at: string;
}

function TripHistory(): JSX.Element {
  const {darkMode, toggleOffDarkMode} = useContext(ThemeContext);
  const {user, refresh} = useUserInfo();
  const [visible, setVisible] = useState<boolean>();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [sortValue, setSortValue] = useState(null);
  const [tripData, setTripData] = useState<TripDataProps[]>([]);
  const [items, setItems] = useState([
    {label: 'Sorted by recent', value: 'recent'},
    {label: 'Sorted by high amount', value: 'amount'},
  ]);
  const isDarkMode = darkMode;
  const defaultIndex = user[0].default_index;

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

  const getTripData = useCallback(async () => {
    const {data, error} = await supabase
      .from('transaction')
      .select(
        '*, station_code_to!inner(station_name), station_code_from!inner(station_name)',
      )
      .eq('user_index', user[defaultIndex].user_data[0].user_index)
      .eq('status', true)
      .eq('type', 'spnt');
    if (!error) {
      // console.log(data);
      setTripData(data);
    }
  }, [defaultIndex, user]);

  useEffect(() => {
    getTripData();
  }, [getTripData, refresh]);

  const changeSort = () => {
    if (sortValue === 'recent') {
      return tripData.sort((a, b) => b.id - a.id);
    } else if (sortValue === 'amount') {
      return tripData.sort(
        (a, b) => parseInt(b.amount, 10) - parseInt(a.amount, 10),
      );
    } else {
      return tripData;
    }
  };

  const Item = ({
    transId,
    amount,
    station_code_to,
    station_code_from,
    created_at,
  }: TripDataProps) => (
    <View style={[styles.history]}>
      <Entypo
        name="line-graph"
        size={18}
        color={colors.DARK}
        style={[styles.historyIcon, {backgroundColor: colors.VERIFIED}]}
      />
      <View style={styles.historyLabel}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <FontAwesome6Icon
            name="arrow-turn-down"
            size={14}
            color={isDarkMode ? colors.LIGHT : colors.DARK}
          />
          <Text style={[textStyle, styles.label, {fontSize: 14}]}>
            {station_code_to.station_name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginLeft: 5,
          }}>
          <FontAwesome6Icon
            name="arrow-turn-up"
            size={14}
            color={isDarkMode ? colors.LIGHT : colors.DARK}
            style={{transform: [{rotate: '90deg'}]}}
          />
          <Text style={[textStyle, styles.label, {fontSize: 14}]}>
            {station_code_from.station_name}
          </Text>
        </View>

        <Text style={[textStyle, styles.tranactionId]}>#{transId}</Text>
      </View>
      <View style={styles.historyDetails}>
        <Text style={[textStyle, styles.label]}>{`- ${amount}`}</Text>
        <Text style={[textStyle, styles.tranactionId, {textAlign: 'right'}]}>
          {moment(created_at).format('LLL')}
        </Text>
      </View>
    </View>
  );

  return (
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
          textStyle={[textStyle, {fontFamily: fonts.Vollkorn, fontSize: 16}]}
          listItemLabelStyle={isDarkMode ? textStyle : textStyleAlt}
          placeholder={'Sorted by default'}
          placeholderStyle={[
            textStyle,
            {fontFamily: fonts.KarmaBold, marginTop: 5, fontSize: 14},
          ]}
          dropDownContainerStyle={{
            backgroundColor: colors.LIGHT_HIGHLIGHTED,
            borderWidth: 0,
            elevation: 10,
            paddingHorizontal: 12,
            paddingBottom: 15,
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
      {tripData.length > 0 ? (
        <View style={styles.historyContainer}>
          <FlatList
            data={changeSort()}
            renderItem={({item}) => (
              <Item
                transId={item.transId}
                amount={item.amount}
                created_at={item.created_at}
                station_code_from={item.station_code_from}
                station_code_to={item.station_code_to}
                id={item.id}
              />
            )}
            keyExtractor={item => item.transId}
          />
        </View>
      ) : (
        <View
          style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
          <Text style={[textStyle, styles.label]}>No transaction is found</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    paddingBottom: 100,
    flex: 1,
  },
  sortContainer: {
    margin: 10,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  sort: {borderWidth: 0, minHeight: 40, paddingHorizontal: 20},

  historyContainer: {
    marginTop: 5,
    paddingTop: 20,
    flexDirection: 'column',
    marginHorizontal: 20,
    borderTopWidth: 0.5,
    borderColor: colors.LIGHT_HIGHLIGHTED,
    borderRadius: 1,
    paddingBottom: 45,
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
    marginBottom: 15,
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
    fontSize: 12,
    opacity: 0.7,
  },
  historyLabel: {flex: 1.7},
  historyDetails: {flex: 1, alignItems: 'flex-end'},
});
export default TripHistory;
