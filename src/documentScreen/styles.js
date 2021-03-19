import {StyleSheet, Platform,PixelRatio,Dimensions} from 'react-native';
import React, {Component} from 'react';
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
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'stretch',
      backgroundColor: '#009FFF',
    },
    textInput: {
      height: 60,
      marginRight: 35,
    },

    link: {
      color: 'black',
      textDecorationLine: 'underline',
      fontSize: 16,
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

    buttonText: {
      fontSize: normalize(16),
      color: 'white',
      alignSelf: 'center',
      color: 'white',
      fontWeight: 'bold',
    },
    MainContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'stretch',
    },
    button: {
      height: normalize(40),
      width:normalize(150),
      borderColor: '#F3FAFF',
      backgroundColor: '#1B547C',
      borderRadius: 5,
      marginBottom: 10,
      justifyContent: 'center',
      alignItems:'center',
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
      // underlayColor='#FF0000',
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
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      backgroundColor: 'white',
    },
    avatarContainer: {
      borderColor: '#9B9B9B',
      borderWidth: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    avatar: {
      width: normalize(300),
      height: normalize(200),
      alignSelf:'center',
      resizeMode: 'contain',
    },
    underline: {
      textDecorationLine: 'underline',
    },
    addButton:{
      width: normalize(100),
      height: normalize(30),
      backgroundColor: 'white',
      borderColor: 'black',
      borderWidth:0.5,
      borderRadius: 5,
      justifyContent:'center',
      alignItems:'center'
    }
  })
