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
  Container: {
    flex: 1,
  },
  first: {
    flex: 1.1,
    justifyContent: 'center',
    alignItems:'center',
  },
  second: {
    flex: 0.9,
  },
  input: {
    flexDirection: 'row',
    borderWidth: 1,
    width: 280,
    height: 55,
    borderColor: 'grey',
    alignSelf: 'center',
    borderRadius: 5,
  },
  numberInput: {
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#1B547C',
    height: 50,
    width: 280,
    alignSelf: 'center',
    margin: 30,
    justifyContent: 'center',
    borderRadius: 5,
  },
  text1: {
    fontWeight: "bold",
    fontSize: 24,
    alignSelf: "center",
    marginTop: 20,
    color: "red",
  },
  text: {
    fontWeight: "bold",
    fontSize: 18,
    alignSelf: "center",
    margin: 20,
    color: "black",
  },
  image:{
    height: normalize(500),
    resizeMode: "contain",
    alignItems: "center",
  },
  underline: { textDecorationLine: "underline" },

});
