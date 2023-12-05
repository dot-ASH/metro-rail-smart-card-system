import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import React, { useContext } from 'react';
import { colors } from '../../style/colors';
import { ThemeContext } from '../../context/ThemeContext';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { fonts } from '../../style/fonts';
import { useNavigation } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const TermScreen = () => {
  const navigaton = useNavigation();
  const { darkMode } = useContext(ThemeContext);

  const isDarkMode = darkMode;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.DARK : colors.LIGHT,
  };

  const textStyle = {
    color: isDarkMode ? colors.LIGHT_ALT : colors.DARK,
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <View
        style={[
          styles.moduleContainer,
          {
            backgroundColor: isDarkMode ? colors.DARK_SHADE : colors.LIGHT_ALT,
          },
        ]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.back}
            onPress={() => navigaton.goBack()}>
            <IonIcons
              name="chevron-back"
              size={28}
              color={colors.LIGHT_HIGHLIGHTED}
            />
          </TouchableOpacity>
          <Text style={[styles.moduleTitle, textStyle]}>Terms And Conditions</Text>
        </View>
        <ScrollView >
          <View style={styles.body}>
            <Text style={[styles.p, textStyle]}>
              Target_Blank built the Metro Rider app as a Free app. This SERVICE is provided by Target_Blank at no cost and is intended for use as is.
            </Text>
            <Text style={[styles.h1, textStyle]}>Last Update 12th November 2023</Text>
            <Text style={[styles.p, textStyle]}>
              This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.
              If you choose to use our Service, then you agree to the collection and use of information in relation to this policy.</Text>
            <Text style={[styles.h1, textStyle]}>Information Collection and Use</Text>
            <Text style={[styles.p, textStyle]}>
              For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to phone number, username, email. The information that we request will be retained by us and used as described in this privacy policy.
            </Text>
            <Text style={[styles.h1, textStyle]}>Log Data</Text>
            <Text style={[styles.p, textStyle]}>
              We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third-party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.
            </Text>
            <Text style={[styles.h1, textStyle]}>Security</Text>
            <Text style={[styles.p, textStyle]}>
              We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</Text>
            <Text style={[styles.h1, textStyle]}>Service Providers</Text>
            <Text style={[styles.p, textStyle]}>
              We may employ third-party companies and individuals for the following reasons:
            </Text>
            <Text style={[styles.p, textStyle]}>
              • To facilitate our Service;
            </Text >
            <Text style={[styles.p, textStyle]}>
              • To provide the Service on our behalf;
            </Text>
            <Text style={[styles.p, textStyle]}>
              • To perform Service-related services; or
            </Text>
            <Text style={[styles.p, textStyle]}>
              • To assist us in analyzing how our Service is used.
            </Text>
            <Text style={[styles.p, textStyle]}>
              We want to inform users of this Service that these third parties have access to their Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.
            </Text>
            <Text style={[styles.h1, textStyle]}>Security</Text>
            <Text style={[styles.p, textStyle]}>
              We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
            </Text>
            <Text style={[styles.h1, textStyle]}>Links to Other Sites</Text>
            <Text style={[styles.p, textStyle]}>
              This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
            </Text>
            <Text style={[styles.h1, textStyle]}>Children’s Privacy</Text>
            <Text style={[styles.p, textStyle]}>
              These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13 years of age. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do the necessary actions.
            </Text>
            <Text style={[styles.h1, textStyle]}>Changes to This Privacy Policy</Text>
            <Text style={[styles.p, textStyle]}>
              We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.
            </Text>
            <Text style={[styles.p, textStyle]}>
              This policy is effective as of 2023-11-20
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT + 80,
  },
  moduleContainer: {
    height: '105%',
    width: '100%',
    position: 'absolute',
    top: '6%',
    borderRadius: 20,
    zIndex: 5000,
    elevation: 10,
    shadowColor: colors.DARK,
    alignItems: 'center',
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
  body: {
    paddingHorizontal: 20,
    marginBottom: 150
  },
  h1: {
    marginTop: 15,
    fontFamily: fonts.Bree,
    fontSize: 16,
    marginBottom: 5,
  },
  p: {
    fontFamily: fonts.Vollkorn,
    fontSize: 13,
    lineHeight: 23,
  }
});

export default TermScreen;
