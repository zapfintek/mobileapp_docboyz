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
  text: {
    fontSize: normalize(15),
    color: 'red',
    margin: 5,
  },
  list: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginTop: 5,
  },
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
    paddingBottom: 5,
    paddingTop: 5,
  },
  listView1: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: normalize(5),
    margin: normalize(10),
    marginTop: 0,
    backgroundColor: 'lightgray',
    padding: normalize(10),
    shadowOffset: {width: 10, height: 10},
    shadowColor: '#c4c1c1',
    shadowOpacity: 1.0,
    elevation: 10,
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
    fontSize: normalize(14),
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    textAlign: 'left',
  },
  pickupPerson: {
    color: 'black',
    fontSize: normalize(14),
    fontWeight: 'bold',
    alignItems: 'flex-start',
    width: '70%',
    marginTop: -5,
  },
  listView4: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 0,
    marginLeft: 0,
  },
  listView5: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  addressText: {
    fontSize: normalize(11),
    paddingLeft: normalize(5),
    width: '95%',
    textAlign: 'left',
  },
  pickup_date: {
    fontSize: normalize(11),
    paddingLeft: 5,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#c4bfbf',
    marginTop: normalize(6),
    marginBottom: normalize(6),
  },
  cityText: {
    fontSize: normalize(11),
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
    fontSize: normalize(14),
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
    height: normalize(30),
    width: normalize(130),
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: normalize(10),
  },
  assignPickupButtonText: {
    fontSize: normalize(12),
    fontWeight: 'bold',
    color: 'white',
  },
  resumeButton: {
    height: normalize(25),
    width: '90%',
    borderColor: '#1B547C',
    backgroundColor: 'green',
    borderRadius: normalize(5),
    margin: 5,
    alignSelf: 'center',
  },
  resumeText: {
    fontSize: normalize(12),
    color: 'white',
    alignSelf: 'center',
    margin: 5,
    fontWeight: 'bold',
  },
  searchButoon: {
    borderColor: '#1B547C',
    backgroundColor: '#1B547C',
    borderWidth: 1,
    borderRadius: 5,
    height: normalize(25),
    width: normalize(59),
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: normalize(13),
    fontWeight: 'bold',
  },
  serchBox: {
    height: 30,
    borderColor: 'gray',
    margin: normalize(10),
    padding: 4,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: normalize(14),
  },
});
