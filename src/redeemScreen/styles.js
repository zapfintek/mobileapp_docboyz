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

// based on iphone 5s's scale
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
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFF',
    paddingBottom: normalize(50),
  },
  textInput: {
    height: 60,
    marginRight: 35,
  },
  circleText: {
    color: 'white',
    fontSize: normalize(18),
    alignSelf: 'center',
    marginTop: normalize(2),
  },

  circleView: {
    backgroundColor: '#E41313',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(100),
    height: normalize(120),
    width: normalize(120),
    marginBottom: normalize(25),
  },
  ratingText: {
    backgroundColor: 'pink',
    marginTop: 5,
    marginBottom: 20,
    borderRadius: 5,
    padding: 5,
    height: 30,
  },
  view: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  textInput: {
    height: normalize(40),
    width: '83%',
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: 3,
    padding: normalize(5),
  },
  buttonView: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
    width: '90%',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
    color: 'white',
    fontWeight: '400',
  },
  text: {
    fontSize: normalize(11),
    fontWeight: '500',
  },
  button: {
    height: normalize(45),
    borderColor: '#F3FAFF',
    backgroundColor: '#1B547C',
    borderRadius: 10,
    margin: normalize(10),
    justifyContent: 'center',
    alignSelf: 'stretch',
    width: '85%',
    alignSelf: 'center',
  },
  update: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  delete: {
    height: 36,
    marginTop: 10,
    backgroundColor: '#FF0000',
    borderColor: '#FF0000',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  panel: {
    flex: 1,
  },
  panelHeader: {
    height: 50,
    backgroundColor: '#cbe9f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelBody: {
    flex: 5,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    backgroundColor: '#01A3F8',
  },
});
