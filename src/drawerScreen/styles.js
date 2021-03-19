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
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  container1: {
    height: normalize(165),
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  secondView: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'red',
    paddingTop: normalize(10),
  },
  name: {
    alignSelf: 'center',
    fontSize: normalize(16),
    color: '#1B547C',
    fontWeight: 'bold',
    marginTop: normalize(15),
    textAlign: 'center',
  },
  address: {
    alignSelf: 'center',
    fontSize: normalize(13),
    color: '#1B547C',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    position: 'absolute',
    bottom: 0,
  },
  touchableHighlight: {
    justifyContent: 'center',
  },
  underline: {
    marginLeft: normalize(15),
    fontSize: normalize(15),
    fontWeight: 'bold',
    color: 'white',
  },
  diveder: {
    height: 1,
    width: '100%',
    backgroundColor: 'gainsboro',
    marginTop: normalize(10),
    marginBottom: normalize(10),
  },
  avatar: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: 80,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: normalize(15),
    height: normalize(45),
  },
  profilePic: {
    alignSelf: 'center',
    width: normalize(80),
    height: normalize(80),
    borderRadius: 80,
    marginTop: 5,
  },
});
