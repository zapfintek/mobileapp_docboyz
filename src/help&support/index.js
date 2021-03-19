import React from 'react';
import {Text, View, Image, StyleSheet, Dimensions,PixelRatio} from 'react-native';
import {Header} from 'react-native-elements';
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
  static navigationOptions = {
    drawerLockMode: 'locked-closed',
    headerTitle: 'FeedBack',
    headerStyle: {backgroundColor: 'deepskyblue'},
    headerLeft: null,
    headerTitleStyle: {flex: 1, textAlign: 'center'},
    drawerLabel: 'Help Support',
  };

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
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
            text: 'Help & Support',
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
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: '#FFFF',
          }}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-evenly',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 30,
                color: '#1B547C',
              }}>
              Support FAQs
            </Text>
            <Image
              style={{
                width: 150,
                height: 150,
                alignSelf: 'center',
                marginTop: 30,
              }}
              source={require('../assets/DOCBOYZ.png')}
            />

            <View style={{justifyContent: 'center', marginTop: 50}}>
              <Text style={{textAlign: 'center'}}>
                We Know Privacy and security is important to you
              </Text>
              <Text style={{textAlign: 'center', marginTop: 20}}>
                We-Connect data is used to help us improve our
                {'\n'}
                product.This data is an anonymous from not
                {'\n'}
                connected with individual app users
              </Text>
              <Text style={{textAlign: 'center', marginTop: 20}}>
                For more Information you can connect us on
                {'\n'}
                attached Email:{' '}
                <Text style={styles.text}>Support@docboyz.in</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});
