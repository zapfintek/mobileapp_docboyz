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
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  textInput: {
    height: 60,
    marginRight: 35,
  },
  circleText: {
    alignSelf: 'center',
    fontSize: normalize(15),
    color: 'black',
    fontWeight: 'bold',
  },
  circleText1: {
    alignSelf: 'center',
    fontSize: normalize(14),
    color: 'mediumseagreen',
    fontWeight: 'bold',
  },
  link: {
    color: 'black',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  circleView: {
    flexDirection: 'column',
    backgroundColor: 'white',
    margin: normalize(10),
    padding: normalize(20),
    marginBottom:normalize(20),
    shadowOffset: {width: 10, height: 10},
    shadowColor: '#c4c1c1',
    shadowOpacity: 1,
    elevation: 10,
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
    height: 40,
    width: 200,
    borderWidth: 1,
    alignSelf: 'center',
  },
  buttonView: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
    width: '90%',
    alignSelf: 'center',
  },
  buttonView1: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '90%',
  },
  buttonText: {
    fontSize: normalize(15),
    color: 'white',
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  textInput: {
    margin: normalize(20),
  },
  button: {
    height: normalize(40),
    width: '90%',
    borderColor: '#F3FAFF',
    backgroundColor: 'red',
    borderWidth: 1,
    borderRadius: normalize(5),
    justifyContent: 'center',
    alignItems: 'center',
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
  lastView: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#f4f6f6',
  },
  insideView1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insideView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: normalize(5),
  },
  panelHeader: {
    alignSelf: 'center',
    fontWeight: '500',
    fontSize: normalize(10),
    marginLeft: normalize(5),
  },
  panelBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(10),
  },
  Image: {
    width: normalize(250),
    height: normalize(200),
    alignSelf: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  loan: {
    alignSelf: 'center',
    fontWeight: '500',
    fontSize: normalize(10),
  },
  address: {
    fontSize: normalize(12),
    fontWeight: '500',
    color: 'black',
    marginLeft: normalize(5),
  },
  divider: {
    backgroundColor: 'black',
    alignSelf: 'center',
    height: 0.5,
    width: '100%',
    marginTop: normalize(6),
    marginBottom: normalize(6),
  },
  podText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: normalize(14),
    color: 'black',
  },
  opacity:{
    justifyContent:'center',
    alignItems:'center'
  }
});
