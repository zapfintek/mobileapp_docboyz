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
      alignItems: 'center',
    },
    second: {
      flex: 0.9,
    },
    input: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      width: '80%',
      height: normalize(50),
      borderColor: 'grey',
      alignSelf: 'center',
      borderRadius: 5,
    },
    numberInput: {
      fontSize: normalize(15),
      color: 'black',
    },
    button: {
      backgroundColor: '#1B547C',
      height: normalize(45),
      width: '70%',
      alignSelf: 'center',
      margin: normalize(30),
      justifyContent: 'center',
      borderRadius: 5,
    },
    dialog: {
      backgroundColor: 'white',
      width: 300,
      height: 200,
      borderRadius: 10,
      marginTop: 90,
      shadowOffset: {
        width: 5,
        height: 5,
      },
      borderColor: 'grey',
      borderRadius: 10,
      padding: 5,
      borderWidth: 1,
      elevation: 5,
    },
    simNumbers: {
      flexDirection: 'row',
      margin: 5,
      marginTop: 20,
      padding: 5,
    },
    img: {
      height: 35,
      width: 35,
      marginLeft: 20,
      marginTop: 10,
      borderRadius: 20,
      borderColor: 'grey',
      tintColor: 'black',
    },
    mobText: {
      fontSize: 18,
      marginTop: 10,
      marginLeft: 10,
      color: 'black',
    },
    modelView: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    close: {
      justifyContent: 'flex-end',
      marginTop: 20,
      marginLeft: 10,
    },
    text: {
      fontSize: normalize(25),
      fontWeight: 'bold',
      color: '#1B547C',
      marginTop: normalize(15),
    },
    image: {
      height: 30,
      width: 30,
      marginLeft: 5,
    },
    image1: {
      height: normalize(90),
      width: normalize(90),
      borderRadius: 100,
    },
    inputBox: {
      backgroundColor: 'transparent',
      width: '55%',
      fontSize: normalize(14),
      fontWeight:'500'

    },
    continue: {
      fontSize: normalize(15),
      padding: 10,
    },
    none: {
      fontSize: normalize(18),
      color: 'green',
    },
    number: {
      fontSize: normalize(14),
      margin: normalize(5),
      color: 'black',
      fontWeight:'500'
    },
    emailInput: {
      height: normalize(50),
      width: '80%',
      alignSelf: 'center',
      color: 'black',
      fontWeight:'500',
      fontSize: normalize(14),
    },
    lebal: {
      fontSize: normalize(13),
      textAlign: 'right',
      margin: normalize(10),
      marginRight: normalize(25),
      fontWeight:'500'
    },
    loadingView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
      opacity: 0.7,
    },
    loadingBox: {
      height: normalize(80),
      width: '80%',
      borderRadius: normalize(8),
      backgroundColor: 'white',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: normalize(25),
    },
    pleaseWait: {
      color: 'black',
      fontSize: normalize(18),
      marginLeft: normalize(18),
      fontWeight:'500'
    },
    buttonText:{ fontSize: normalize(15), textAlign: "center", color: "white",fontWeight:'500' }
  });
