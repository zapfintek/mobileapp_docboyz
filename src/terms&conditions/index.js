import React from 'react';
import {Text, View, Dimensions,PixelRatio} from 'react-native';
import {Divider, Header, Icon} from 'react-native-elements';
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
export default class TermsConditions extends React.Component {
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
       <Header
          backgroundColor="#E41313"
          leftComponent={{
            icon: 'arrow-back',
            color: '#fff',
            onPress: () => {
              this.props.navigation.navigate('Home');
            },
          }}
          centerComponent={{
            text: 'Terms & Conditions',
            style: { 
              color: 'white',
            fontSize: normalize(20),
            fontWeight:'bold',
            letterSpacing:1
          },
          }}
          outerContainerStyles={{
            backgroundColor: '#E41313',
            padding: normalize(5),
          }}
          innerContainerStyles={{justifyContent: 'space-between'}}
        />

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: 'red', fontSize: 20}}>
            Terms and Conditions!
          </Text>
        </View>
      </View>
    );
  }
}
