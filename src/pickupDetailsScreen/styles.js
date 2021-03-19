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
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 10,
    marginLeft: 7,
    marginRight: 7,
    marginBottom: 5,
    backgroundColor: '#F5F5F6',
    shadowOffset: {width: 10, height: 10},
    shadowColor: '#c4c1c1',
    shadowOpacity: 1.0,
    elevation: 10,
  },
  list: {
    justifyContent: 'center',
    margin: normalize(10),
    marginLeft: 7,
    marginRight: 7,
    marginBottom: 5,
    backgroundColor: '#F5F5F6',
    shadowOffset: {width: 10, height: 10},
    shadowColor: '#c4c1c1',
    shadowOpacity: 1.0,
    elevation: 10,
  },
  flatList: {
    margin: normalize(10),
    backgroundColor: 'white',
    shadowOffset: {width: 10, height: 10},
    shadowColor: '#c4c1c1',
    shadowOpacity: 1.0,
    elevation: 10,
  },
  text: {
    fontSize: normalize(15),
    color: 'red',
    margin: 5,
  },
  list: {
    padding: normalize(10),
  },
  listView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listTextView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '60%',
  },
  listHeading: {
    alignSelf: 'flex-start',
    fontSize: normalize(16),
    color: 'black',
    fontWeight: 'bold',
  },
  listView2: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  listView3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productNmae: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    textAlign: 'center',
  },
  pickupPerson: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
    alignItems: 'flex-start',
    width: 200,
    marginTop: -5,
  },
  listView4: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 0,
    marginLeft: 0,
  },
  listView5: {
    // flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  addressText: {
    fontSize: 10,
    paddingLeft: 1,
    width: '98%',
  },
  pickup_date: {
    fontSize: 10,
    paddingLeft: 5,
  },
  divider: {
    backgroundColor: '#897d7b',
    marginTop: 2,
  },
  cityText: {
    fontSize: 10,
    color: 'black',
    textAlignVertical: 'center',
  },
  acceptPickupButton: {
    borderRadius: 7,
    height: 30,
    backgroundColor: '#1B547C',
    padding: 5,
    margin: 10,
  },
  acceptPickupButton: {
    borderRadius: 7,
    height: 30,
    backgroundColor: '#1B547C',
    padding: 5,
    margin: 10,
  },
  acceptPickupButton: {
    borderRadius: 7,
    height: 30,
    backgroundColor: '#1B547C',
    padding: 5,
    margin: 10,
  },
  acceptPickupButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  dropDownText: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'black',
  },

  selectedSubItemText: {
    color: 'red',
    fontSize: 18,
    fontWeight: '500',
  },
  startPickupButton: {
    height: 30,
    width: '45%',
    borderColor: '#1B547C',
    backgroundColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  assignPickupButtonText: {
    fontSize: 13,
    color: 'white',
    alignSelf: 'flex-start',
    fontWeight: '400',
    margin: 5,
    fontWeight: '400',
    marginLeft: 20,
  },
  mainView: {
    flex: 1,
    height: 30,
    marginBottom: 20,
    marginTop: -8,
  },
  testInput: {
    height: 30,
    borderColor: 'gray',
    margin: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  searchBar: {
    borderColor: '#1B547C',
    backgroundColor: '#1B547C',
    borderWidth: 1,
    borderRadius: 5,
    height: 25,
    width: 60,
  },
  searchBarText: {color: 'white', alignSelf: 'center'},
  buttonView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: -10,
  },
  container: {
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    width: '94%',
    alignSelf: 'center',
  },
  headerText1: {
    color: 'white',
    textAlign: 'center',
    fontSize: 22,
    color: 'white',
  },
  headerTextView: {
    height: 30,
    borderWidth: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    color: '#ffffff',
  },
  header: {
    flex: 1,
  },
  headerText: {
    textAlign: 'center',
    fontSize: normalize(14),
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
  },
  simpleAccordion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  simpleAccordion1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-around',
  },
  activityName: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: normalize(13),
    letterSpacing: 1,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(35),
    width: '80%',
    borderColor: '#1B547C',
    backgroundColor: '#800080',
    alignSelf: 'center',
    margin: normalize(10),
  },
  buttonText: {
    fontSize: normalize(14),
    color: 'white',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  queText: {
    fontWeight: 'bold',
    fontSize: normalize(11),
    alignSelf: 'flex-start',
  },
  opacity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mobileNo: {
    alignSelf: 'center',
    fontSize: normalize(12),
    color: 'mediumseagreen',
    fontWeight: 'bold',
  },
  listView6: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: normalize(10),
  },
});
