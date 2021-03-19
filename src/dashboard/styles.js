import {StyleSheet, PixelRatio, Dimensions} from 'react-native';
var FONT_BACK_LABEL = 900;
var FONT_BACK_LABEL1 = 50;
var FONT_BACK_LABEL2 = 60;
var FONT_BACK_LABEL3 = 18;
var FONT_BACK_LABEL4 = 60;
var FONT_BACK_LABEL5 = 13;
var FONT_BACK_LABEL6 = 50;
var FONT_BACK_LABEL7 = 270;
var FONT_BACK_LABEL9 = 80;
var FONT_BACK_LABEL8 = 100;
var FONT_BACK_LABEL10 = 120;
var FONT_BACK_LABEL11 = 320;

if (PixelRatio.get() <= 2) {
  FONT_BACK_LABEL = 800;
  FONT_BACK_LABEL1 = 40;
  FONT_BACK_LABEL2 = 50;
  FONT_BACK_LABEL3 = 14;
  FONT_BACK_LABEL4 = 40;
  FONT_BACK_LABEL5 = 10;
  FONT_BACK_LABEL6 = 30;
  FONT_BACK_LABEL7 = 260;
  FONT_BACK_LABEL8 = 110;
  FONT_BACK_LABEL9 = 60;
  FONT_BACK_LABEL10 = 110;
  FONT_BACK_LABEL11 = 250;
}
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
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  modelView: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    borderRadius:10
  },
  text1: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  modelView1: {
    height: normalize(250),
    width: '80%',
    backgroundColor: '#ECF0F1',
    borderRadius: 12,
  },
  modelView2: {
    height: normalize(50),
    backgroundColor: '#1B547C',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: normalize(30),
  },
  modelText: {
    fontSize: normalize(20),
    alignSelf: 'center',
    color: 'white',
  },
  avtaar: {
    borderRadius: 100,
    borderColor: '#E41313',
    height: normalize(120),
    width: normalize(120),
    backgroundColor: '#E41313',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: normalize(16),
    color: 'white',
    marginTop:normalize(5)
  },
  mainview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'relative',
  },
  subView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    height: normalize(100),
    flex: 1,
  },
  underline: {textDecorationLine: 'underline'},
  hiiText: {
    color: 'red',
    fontSize: normalize(20),
    alignSelf: 'center',
    fontWeight:'bold'
  },
  headingView: {
    color: 'red',
    fontSize: normalize(20),
    alignSelf: 'center',
    padding: normalize(20),
    paddingBottom: normalize(10),
  },
  roundView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: normalize(15),
  },
  secondView: {
    flex: 1.5,
    justifyContent: 'center',
  },
  lastView: {
    height: normalize(110),
    width: '100%',
    backgroundColor: '#1B547C',
  },
  pageViewerText: {
    fontSize: normalize(15),
    color: 'white',
    alignSelf: 'center',
    fontWeight:'bold'
  },
  pageViewerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: normalize(15),
    paddingLeft: normalize(30),
    paddingRight: normalize(30),
    paddingBottom: 0,
  },
  pageViewerView1: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  container2: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
});
