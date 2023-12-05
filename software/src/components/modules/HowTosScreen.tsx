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

const HowTosScreen = () => {
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
          <Text style={[styles.moduleTitle, textStyle]}>Usage Instruction</Text>
        </View>
        <ScrollView >
          <View style={styles.body}>
            <Text style={[styles.h1, textStyle]}>
              1. Account Creation and Profiles:
            </Text>
            <Text style={[styles.p, textStyle]}>
              1.1. Your initiation into the Metro Rider realm commences with the creation of an account, a process necessitating the provision of precise and up-to-date information. Within this account, the option to create and manage multiple user profiles awaits, allowing for a personalized and multifaceted user experience.
            </Text>
            <Text style={[styles.p, textStyle]}>
              1.2. Safeguarding the confidentiality of your account credentials is paramount. Additionally, the responsible utilization of multiple profiles falls under your purview.
            </Text>

            <Text style={[styles.h1, textStyle]}>
              2. Money Recharge and Payments:
            </Text>
            <Text style={[styles.p, textStyle]}>
              2.1. To facilitate seamless transactions within the Metro Rider ecosystem, we present a novel money rechargeable option, ensuring a fluid and efficient financial interaction.
            </Text>
            <Text style={[styles.p, textStyle]}>
              2.2. The intricate landscape of monetary transactions is navigated effortlessly through a sophisticated Graphical User Interface (GUI) application intricately interwoven into the Metro Rider experience.
            </Text>
            <Text style={[styles.p, textStyle]}>
              2.3. Upholding the highest standards of security, Metro Rider employs industry-standard encryption protocols to shield your financial data during all payment transactions.
            </Text>
            <Text style={[styles.p, textStyle]}>
              2.4. The financial commitment extends to covering all charges incurred on your account, encompassing applicable taxes and fees.
            </Text>

            <Text style={[styles.h1, textStyle]}>
              3. Money Viewing Option:
            </Text>
            <Text style={[styles.p, textStyle]}>
              3.1. Immerse yourself in the financial dimension of your Metro Rider experience with the integrated money viewing option, providing real-time insights into your account balance and transactional activities.
            </Text>
            <Text style={[styles.p, textStyle]}>
              3.2. While we diligently strive for accuracy in the presentation of financial data, the inherent nature of third-party payment processors and external factors may contribute to occasional discrepancies beyond our immediate control.
            </Text>

            <Text style={[styles.h1, textStyle]}>
              4. Profile Management:
            </Text>
            <Text style={[styles.p, textStyle]}>
              4.1. The canvas of personalization unfolds through the robust profile management functionality embedded within Metro Rider. Here, users can seamlessly update and refine personal information and preferences to ensure a tailor-made experience.
            </Text>
            <Text style={[styles.p, textStyle]}>
              4.2. As the steward of your user profile, the responsibility rests with you to maintain accuracy and timeliness in the information encapsulated within.
            </Text>

            <Text style={[styles.h1, textStyle]}>
              5. Multi-User Profiles:
            </Text>
            <Text style={[styles.p, textStyle]}>
              5.1. Metro Rider transcends conventional boundaries by accommodating the creation and meticulous management of multiple user profiles within a singular account, a testament to our commitment to convenience.
            </Text>
            <Text style={[styles.p, textStyle]}>
              5.2. Each individual user profile is subject to the overarching umbrella of these Terms, underscoring your accountability for the actions executed under each distinct profile.
            </Text>

            <Text style={[styles.h1, textStyle]}>
              6. Secure Transactions:
            </Text>
            <Text style={[styles.p, textStyle]}>
              6.1. Paramount to the Metro Rider ethos is an unwavering commitment to the fortification of your financial transactions. However, it is prudent to acknowledge that the digital landscape, while fortified, is not impervious to risk. Consequently, absolute security cannot be guaranteed.
            </Text>
            <Text style={[styles.p, textStyle]}>
              6.2. Users are encouraged to promptly report any instances of unauthorized access to their accounts, fostering a collective effort in maintaining the integrity of the Metro Rider community.
            </Text>

            <Text style={[styles.h1, textStyle]}>
              7. Transaction History Management:
            </Text>
            <Text style={[styles.p, textStyle]}>
              7.1. The journey through Metro Rider is augmented by the inclusion of a comprehensive transaction history feature, allowing users to revisit and scrutinize their past monetary interactions within the app.
            </Text>
            <Text style={[styles.p, textStyle]}>
              7.2. The meticulous maintenance of accurate records is our commitment, but we acknowledge the possibility of discrepancies. Should any concerns arise, we encourage users to expeditiously relay them to our dedicated customer support.
            </Text>

            <Text style={[styles.h1, textStyle]}>
              8. Termination:
            </Text>
            <Text style={[styles.p, textStyle]}>
              8.1. Metro Rider reserves the prerogative to terminate or suspend user accounts at its sole discretion, without prior notice, in the event of a breach of these Terms or any other circumstances deemed pertinent.
            </Text>
            <Text style={[styles.p, textStyle]}>
              8.2. Users retain the liberty to terminate their accounts at any juncture by adhering to the stipulated procedures.
            </Text>

            <Text style={[styles.h1, textStyle]}>
              9. Changes to Terms:
            </Text>
            <Text style={[styles.p, textStyle]}>
              9.1. The dynamism inherent in technological evolution necessitates occasional updates to these Terms. It is the responsibility of users to periodically review and acquaint themselves with any revisions.
            </Text>
            <Text style={[styles.p, textStyle]}>
              9.2. Continued use of the Metro Rider application following modifications to the Terms signifies an acceptance of the revised conditions.
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
    fontSize: 18,
    marginBottom: 5,
  },
  p: {
    fontFamily: fonts.Vollkorn,
    lineHeight: 23,
    fontSize: 13,
  }
});

export default HowTosScreen;;
