import {StyleSheet, PixelRatio, Dimensions} from 'react-native';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;
export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}
export default StyleSheet.create({
  text: {
    marginTop: normalize(15),
    fontSize: normalize(25),
    color: 'red',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  text1: {
    fontSize: normalize(14),
    color: 'midnightblue',
    fontWeight: 'bold',
    lineHeight: normalize(20),
  },
  text2: {
    fontSize: normalize(14),
    color: 'red',
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: normalize(4),
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  list: {
    flex: 1,
    justifyContent: 'space-between',
  },
  list1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: normalize(15),
    paddingTop: normalize(30),
  },
  image: {
    width: normalize(80),
    height: normalize(80),
    alignSelf: 'center',
    borderRadius: 100,
  },
  image1: {
    width: normalize(100),
    height: normalize(70),
  },
  companyName: {
    color: 'midnightblue',
    fontSize: normalize(15),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: normalize(10),
  },
});
