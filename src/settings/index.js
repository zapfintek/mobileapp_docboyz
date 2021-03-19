import React from 'react';
import {Text, View, BackHandler, Dimensions, PixelRatio} from 'react-native';
import {Header} from 'react-native-elements';
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
export default class Settings extends React.Component {
  static navigationOptions = {
    drawerLockMode: 'locked-closed',
    headerTitle: 'Settings',
    headerStyle: {
      backgroundColor: 'deepskyblue',
    },
    headerLeft: null,
    headerTitleStyle: {
      flex: 1,
      textAlign: 'center',
    },
    drawerLabel: 'Settings',
  };

  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  };

  handleBackButton = () => {
    this.props.navigation.navigate('Home');
    return true;
  };

  componentWillMount = async () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  };

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Header
          backgroundColor="#E41313"
          leftComponent={{
            icon: 'arrow-back',
            color: '#fff',
            onPress: () => {
              this.props.navigation.replace('MyDrawer');            },
          }}
          centerComponent={{
            text: 'Settings',
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
          <Text style={{color: 'red', fontSize: 20}}>Settings!</Text>
        </View>
      </View>
    );
  }
}
