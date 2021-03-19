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
      flexDirection: "column",
      justifyContent: "center",
      borderRadius: normalize(5),
      margin: normalize(10),
      marginTop: 0,
      backgroundColor: "lightgray",
      padding:normalize(10),
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
    marginBottom:normalize(5)
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
  },
  addressText: {
    fontSize: normalize(11),
    paddingLeft: normalize(10),
    width: '98%',
  },
  pickup_date: {
    fontSize: normalize(11),
    paddingLeft: 5,
  },
  divider: {
    height:0.5,
      backgroundColor:'#c4bfbf',
      marginTop: normalize(6),
      marginBottom: normalize(6),
  },
  cityText: {
    fontSize: normalize(11),
    color: 'black',
    textAlignVertical: 'center',
  },
  acceptPickupButton: {
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    height: normalize(30),
    width: '100%',
    backgroundColor: '#1B547C',
    margin: normalize(5),
  },
  acceptPickupButtonText: {
    fontSize: normalize(12),
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
  },
});
