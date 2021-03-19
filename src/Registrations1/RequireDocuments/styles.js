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
  PersonalContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {alignItems: 'center', marginRight: 50},
  FirstCard: {
    flex: 1,
    margin: Platform.OS === 'ios' ? 40 : 30,
    marginTop: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    elevation: 5,
    opacity: 0.9,
  },
  button: {
    height: normalize(30),
    width: normalize(60),
    backgroundColor: '#E41313',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 5,
    elevation: 5,
  },
  backButton: {
    backgroundColor: '#1B547C',
    alignSelf: 'flex-start',
    marginBottom: 15,
    marginLeft: 15,
    marginTop: 20,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 5,
    elevation: 5,
  },
  loginSteps: {
    height: normalize(50),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: normalize(40),
  },
  icon: {
    color: '#d32f2f',
    padding: 0,
    margin: 0,
  },
  text: {
    color: '#d32f2f',
    fontSize: normalize(14),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  mainView: {
    backgroundColor: 'white',
    padding: 5,
    height: normalize(50),
    justifyContent: 'center',
    elevation: 20,
  },
  heading: {
    textAlign: 'center',
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  textInput: {
    marginBottom: 5,
    marginLeft: 25,
    marginRight: 25,
  },
  redio: {
    alignSelf: 'center',
    marginTop: 10,
  },
  bottomView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
  },
  text1: {
    color: 'white',
    margin: 5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text2: {
    fontSize: normalize(18),
    textAlign: 'center',
    margin: 5,
    color: 'black',
    fontWeight: 'bold',
  },
  text3: {
    width: '60%',
    fontSize: normalize(14),
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  image: {
    width: 80,
    height: 80,
    marginTop: 5,
    alignSelf: 'center',
  },
  image1: {
    width: 80,
    height: 80,
    marginTop: 5,
    marginLeft: 10,
    alignSelf: 'center',
  },
  addButton: {
    borderRadius: 5,
    height: normalize(27),
    width: normalize(50),
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    marginRight: 10,
  },
  addText: {
    fontSize: normalize(14),
    color: 'black',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'lightgrey',
    marginTop: 8,
  },
  lastView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    height: normalize(45),
    alignSelf: 'center',
  },
  text1: {
    fontSize: normalize(13),
    color: 'white',
    fontWeight: 'bold',
  },
});
