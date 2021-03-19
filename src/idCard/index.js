import * as React from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  AsyncStorage,
  BackHandler,
  ActivityIndicator,
  ScrollView,
  PixelRatio,
  Dimensions,
} from 'react-native';
// import QRCode from 'react-native-qrcode-svg';
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
import Snackbar from 'react-native-snackbar';
import {List, Header} from 'react-native-elements';
import styles from './styles';

export default class IDCARD extends React.Component {
  static navigationOptions = {
    drawerLockMode: 'locked-closed',
    drawerLabel: 'ID_Card',
  };
  constructor() {
    super();
    this.state = {
      data_array: [],
      agentId: '',
      Image: '',
      text: '',
      Created_at: '',
      flexs: 4,
      loading: false,
    };
    this.LoadData();
  }

  handleBackButton = () => {
    this.props.navigation.navigate('Home');
    return true;
  };
  LoadData = async () => {
    await AsyncStorage.getItem('AGENT_ID', (err, result) => {
      if (result != '') {
        this.setState({
          agentId: result,
          loading: true,
          data_array: [],
        });
      }
    });
    console.log(this.state.agentId);
    await fetch('https://docboyz.in/docboyzmt/api/viewProfile', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId: this.state.agentId,
      }),
    })
      .then(
        (response) => response.json(), //ADDED >JSON() HERE
        (error) => console.log('An error occurred.', error),
      )
      .then(async (res) => {
        console.warn('res', res);
        if (res.error == 0) {
          let {error, user: user} = res;
          // console.warn(user);
          if (user != '') {
            this.state.data_array.push(user);
          }
          this.setState({loading: false});
        } else {
          this.setState({loading: false});
          Snackbar.show({
            text: res.message,
            duration: Snackbar.LENGTH_LONG,
          });
        }
      })
      .catch((error) => {
        this.setState({loading: false});
        console.log(error.message);
      });
  };

  renderRow({item}) {
    // console.warn('item', item);
    var text = `${item.name},${item.city},${item.state},${item.pincode},
    DOB:${item.dob},DOJ:${item.created_at}
    Authorised to do pickups for-LOANTAP,FLEXI,QBERA,GO-UPWARDS,INDIALANDS,AXIS BANK,MINTIFI,`;
    console.log(text);
    return (
      <View style={styles.list}>
        <View style={{alignItems: 'center', padding: normalize(30)}}>
          <Image
            style={styles.image}
            source={{
              uri: `https://dockboyz.s3.ap-south-1.amazonaws.com/uploads/agents/${item.profile_pic}`,
            }}
          />
          <Text style={styles.text}>{item.name}</Text>
          <Text style={styles.text2}>(Finteck Correspondent)</Text>
        </View>
        <View style={styles.list1}>
          <View style={{alignItems: 'center'}}>
            <Image
              style={styles.image1}
              source={require('../assets/DB.png')}
              resizeMode="contain"
            />
            <Text style={styles.companyName}>
              ZapFin Teknologies{'\n'}Pvt Ltd.
            </Text>
          </View>
          {/* <QRCode
              value={text}
              size={120}
              bgColor="midnightblue"
              fgColor="white"
            /> */}
          <Text style={styles.text1}>
            Agent Id:{item.id}
            {'\n'}
            City:{item.city}
            {'\n'}
            Address:11B, Aditya {'\n'}Business Center,{'\n'}
            3rd Flour NIBM {'\n'}Road Pune-411048
          </Text>
        </View>
      </View>
    );
  }

  render() {
    // console.warn(this.state.data_array);
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
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
              text: 'Id Card',
              style: {
                color: 'white',
                fontSize: normalize(20),
                fontWeight: 'bold',
                letterSpacing: 1,
              },
            }}
            outerContainerStyles={{backgroundColor: '#E41313', height: 55}}
            innerContainerStyles={{justifyContent: 'space-between'}}
          />
          <ActivityIndicator size="large" color="black" />
          <View></View>
        </View>
      );
    }

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
            text: 'Id Card',
            style: {
              color: 'white',
              fontSize: normalize(20),
              fontWeight: 'bold',
              letterSpacing: 1,
            },
          }}
          outerContainerStyles={{backgroundColor: '#E41313', height: 55}}
          innerContainerStyles={{justifyContent: 'space-between'}}
        />
        <View style={{flex: 0.1, justifyContent: 'center'}} />
        <View style={{flex: 1}}>
          <FlatList
            extraData={this.state}
            data={this.state.data_array}
            renderItem={this.renderRow}
          />
        </View>
      </View>
    );
  }
}
