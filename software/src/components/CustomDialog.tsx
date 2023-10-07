import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  UIManager,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../style/colors';
import {fonts} from '../style/fonts';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';

type CustomDialogProps = {
  isVisible: boolean;
  title: string;
  text?: string;
  onConfirm: () => void;
  onCancle: () => void;
};

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const CustomDialog = ({
  isVisible,
  title,
  text,
  onConfirm,
  onCancle,
}: CustomDialogProps): JSX.Element => {
  const [display, setDisplay] = useState<boolean>();

  const toggledialog = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (isVisible) {
      setDisplay(true);
    } else {
      setDisplay(false);
    }
  };

  useEffect(() => {
    toggledialog();
  });

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={[styles.dialogBox, {display: display ? 'flex' : 'none'}]}>
      <View style={[styles.dialog]}>
        <Text style={[styles.title]}> {title}</Text>
        <Text style={[styles.dialogText]}>{text}</Text>
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={onCancle}>
            <FontAwesome6Icon name="xmark" size={28} color={colors.DARK} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onConfirm}>
            <FontAwesome6Icon name="check" size={28} color={colors.DARK} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dialogBox: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 5000,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  dialog: {
    backgroundColor: colors.LIGHT_ALT,
    height: 200,
    width: '80%',
    borderRadius: 17,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: colors.DARK,
    elevation: 20,
  },
  dialogText: {
    marginTop: 5,
    fontFamily: fonts.KarmaBold,
    fontSize: 16,
    color: colors.DARK,
    paddingTop: 25,
  },
  title: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: colors.LIGHT_HIGHLIGHTED,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_HIGHLIGHTED,
    fontSize: 18,
    fontFamily: fonts.Bree,
    alignItems: 'center',
    textAlign: 'center',
    padding: 15,
    elevation: 5,
    color: colors.LIGHT,
  },
  bottomBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    paddingBottom: 25,
  },
});

export default CustomDialog;
