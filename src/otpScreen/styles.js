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
    container: {
        flex: 1,
        margin: 0,
      },
      first: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
      },
      second: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      resendCode: {
        height: 50,
        width: 150,
        borderRadius: 5,
        justifyContent: "center",
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "grey",
        margin: 10,
        backgroundColor: "#1B547C",
      },
      borderStyleBase: {
        width: 30,
        height: 45,
      },
    
      borderStyleHighLighted: {
        borderColor: "#03DAC6",
      },
    
      underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
      },
    
      underlineStyleHighLighted: {
        borderColor: "#03DAC6",
      },
      textInput:{
        width: 180,
        height: 50,
        borderRadius: 10,
        fontSize: 20,
        borderWidth: 1,
        borderColor: "grey",
        textAlign: "center",
        letterSpacing: 5,
      }
});
