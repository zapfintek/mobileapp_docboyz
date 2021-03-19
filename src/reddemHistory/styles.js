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
  row: {
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFF',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  listView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    margin: normalize(10),
    width: '90%',
    alignSelf: 'center',
  },
  insideView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insideView1: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width:'65%',
    marginBottom:normalize(8)
  },
  amuntText: {
    fontSize: normalize(14),
    marginRight: 20,
  },
  Nodata: {
    fontSize: normalize(20),
    alignSelf: 'center',
    color: 'red',
  },
});
