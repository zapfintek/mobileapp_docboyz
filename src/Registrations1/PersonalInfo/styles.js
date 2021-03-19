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
  PersonalContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {alignItems: 'center', marginRight: 50},
  FirstCard: {
    flex: 1,
    margin: 20,
    marginTop: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    elevation: 5,
    opacity: 0.9,
  },
  button: {
    height: normalize(30),
    width: normalize(50),
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  icon: {
    color: '#d32f2f',
    padding: 0,
    margin: 0,
  },
  text: {
    color: '#d32f2f',
    textAlignVertical: 'center',
    fontSize: 16,
    marginBottom: 6,
  },
  mainView: {
    backgroundColor: 'lightgrey',
    marginTop: 0,
    padding: 5,
    height: normalize(50),
    justifyContent: 'center',
  },
  heading1: {
    textAlign: 'center',
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  textInput: {
    height: 40,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 10,
    fontSize: 12,
  },
  redio: {
    alignSelf: 'center',
    marginTop: 10,
  },
  bottomView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text1: {
    fontSize: normalize(13),
    color: 'white',
    fontWeight: 'bold',
  },
  heading: {
    backgroundColor: 'white',
    padding: 5,
    height: normalize(50),
    justifyContent: 'center',
    elevation: 20,
  },
  image: {
    height: 80,
    width: 80,
    marginTop: 20,
    borderRadius: 40,
    backgroundColor: 'lightgrey',
    alignSelf: 'center',
  },
  DOB: {
    height: normalize(30),
    borderBottomColor: '#bababa',
    borderBottomWidth: 0.5,
    width: '80%',
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  dobText: {
    color: '#bababa',
    fontSize: normalize(16),
    fontWeight: '500',
  },
  redio: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
