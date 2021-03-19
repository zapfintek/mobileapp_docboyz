import React from 'react';
import {Text, View, Image,Dimensions,PixelRatio} from 'react-native';
import {Header, Icon} from 'react-native-elements';
// import VideoPlayer from 'react-native-video-player';
import AsyncStorage from '@react-native-community/async-storage';
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
export default class notifications extends React.Component {
  static navigationOptions = {
    drawerLockMode: 'locked-closed',
    headerTitle: 'Notification',
    headerStyle: {
      backgroundColor: 'deepskyblue',
    },
    headerLeft: null,
    headerTitleStyle: {
      flex: 1,
      textAlign: 'center',
    },
  };
  constructor() {
    super();
    this.state = {
      Imageuri: '',
      type: '',
      title: '',
      Message: '',
      data: '',
      loading: false,
      name: {ana: 'jnnd', mam: 'sjkdns'},
    };
  }

  componentWillMount = async () => {
    Called = this.props.navigation.addListener('willFocus', async () => {
      await AsyncStorage.getItem('Notification', (err, item) => {
        if (item) {
          this.setState({data: JSON.parse(item)});
        }
      });
      let {data} = this.state;
      if (data != null) {
        this.setState({loading: true});
        console.log('data', data.foreground);
        if (data.foreground == true) {
          let Datas = data.data;
          console.warn('notification', data.message, Datas);
          if (Datas.type == 'image') {
            this.setState({
              type: 'image',
              uri: Datas.description,
              title: Datas.title,
              Message: data.message,
              loading: false,
            });
          } else if (Datas.type == 'video') {
            this.setState({
              type: 'video',
              uri: Datas.description,
              title: Datas.title,
              Message: data.message,
              loading: false,
            });
          } else {
            this.setState({
              type: 'text',
              title: Datas.title,
              Message: data.message,
              loading: false,
            });
          }
        } else if (data.foreground == false) {
          if (data.type == 'image') {
            this.setState({
              type: 'image',
              uri: data.description,
              title: data.title,
              Message: data.message,
              loading: false,
            });
          } else if (data.type == 'video') {
            this.setState({
              type: 'video',
              uri: data.description,
              title: data.title,
              Message: data.message,
              loading: false,
            });
          } else {
            this.setState({
              type: 'text',
              title: data.title,
              Message: data.message,
              loading: false,
            });
          }
        }
      } else {
        console.log('no notification');
        this.setState({loading: false});
      }
    });
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
              this.props.navigation.replace('MyDrawer');            },
          }}
          centerComponent={{
            text: 'Notification',
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
        {this.state.type == 'image' ? (
          <View style={{flex: 1, justifyContent: 'flex-start'}}>
            <Text style={styles.text1}>DocBoyz</Text>
            <Text style={styles.text1}>{this.state.title}</Text>
            <Text style={styles.text}>{this.state.Message}</Text>
            <Image style={styles.image} source={{uri: this.state.uri}} />
          </View>
        ) : this.state.type == 'video' ? (
          <View style={{flex: 1, justifyContent: 'flex-start', margin: 10}}>
            <Text style={styles.text1}>DocBoyz</Text>
            <Text style={styles.text1}>{this.state.title}</Text>
            <Text style={styles.text}>{this.state.Message}</Text>
            {/* <VideoPlayer
              video={{uri: this.state.uri}}
              videoWidth={2000}
              videoHeight={2000}
            /> */}
          </View>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.text1}>DocBoyz</Text>
            <Text style={styles.text}> There is no notification</Text>
          </View>
        )}
      </View>
    );
  }
}
