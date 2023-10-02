/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {
  Dimensions,
  StatusBar,
  View,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {useState} from 'react';
import {colors} from '../style/colors';
import ProgressBar from 'react-native-progress/Bar';
interface SplashProp {
  isReady: boolean;
  onAnimationFinish?: () => void;
}
const Splash: React.FC<SplashProp> = ({isReady, onAnimationFinish}) => {
  const screen = Dimensions.get('screen');
  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (isReady) {
        setCount(prevProgress => prevProgress + 0.1);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [isReady, count]);

  useEffect(() => {
    if (Math.round(count * 100) > 100 && onAnimationFinish) {
      onAnimationFinish();
    }
  }, [count, onAnimationFinish]);

  return (
    <>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={colors.TRANPARENT}
        translucent={true}
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          backgroundColor: colors.DARK,
        }}>
        <ImageBackground
          source={require('../../assets/splash.png')}
          resizeMode="cover"
          style={{
            height: screen.height,
            width: screen.width,
            position: 'relative',
          }}>
          <View style={styles.container}>
            <ProgressBar
              progress={count}
              width={100}
              height={5}
              unfilledColor={'#3D3A39'}
              borderRadius={10}
              animated
              color={'#8E8787'}
              borderWidth={0}
            />
          </View>
        </ImageBackground>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    bottom: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressBG: {
    width: 50,
    height: 8,
    backgroundColor: '#C4CDD5',
    marginHorizontal: 30,
    borderRadius: 10,
    overflow: 'hidden',
  },

  progress: {
    height: 15,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'black',
    borderRadius: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#005249',
    marginBottom: 20,
  },

  btn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#919EAB',
    borderRadius: 6,
    marginHorizontal: 10,
    marginTop: 40,
  },

  btnText: {
    fontWeight: '500',
    color: '#fff',
  },

  btnBox: {
    flexDirection: 'row',
  },
});
export default Splash;
