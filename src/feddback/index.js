import React from 'react';
import {Text, View, Dimensions,PixelRatio} from 'react-native';
import {Header} from 'react-native-elements';
import styles from './styles';
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
export default class Helpsupport extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="red"
          leftComponent={{
            icon: 'arrow-back',
            color: '#fff',
            onPress: () => {
              this.props.navigation.replace('MyDrawer');
            },
          }}
          centerComponent={{
            text: 'Feedback',
            style: { 
              color: 'white',
            fontSize: normalize(20),
            fontWeight:'bold',
            letterSpacing:1
          },
          }}
          outerContainerStyles={{backgroundColor: '#E41313', height: 55}}
          innerContainerStyles={{justifyContent: 'space-between'}}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFF',
          }}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: 30,
              color: '#1B547C',
            }}>
            FeedBack
          </Text>
        </View>
      </View>
    );
  }
}
