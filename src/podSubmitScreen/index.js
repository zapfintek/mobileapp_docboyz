import React from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  ScrollView,
  Image,
  Dimensions,
  PixelRatio,
} from 'react-native';
import styles from './styles';
import {TextField} from 'react-native-material-textfield';
import {Header, Icon, Divider} from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-community/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
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
export default class PodSubmit extends React.Component {
  static navigationOptions = {
    drawerLabel: 'PickupDetails',
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      PickUp_ID: '',
      data2: '',
      data: '',
      pickup_data: {},
      pickups_id: '',
      pickup_person: '',
      home_address: '',
      mobile: '',
      preferred_start_time: '',
      preferred_end_time: '',
      office_address: '',
      pickup_date: '',
      data2: [],
      comment: '',
      PickupId: '',
      image: '',
      Uri: '',
      comment: '',
      Activity_array: '',
      transaction_id: '',
    };
    this.pastDataCalled();
  }

  handleBackButton = () => {
    this.props.navigation.replace('pickup');
    return true;
  };

  pastDataCalled = async () => {
    this.setState({loading: true});
    Activity_Array = this.props.route.params.Array_data;
    Data = this.props.route.params.data;

    var array = [];
    await array.push(Data);
    console.warn(array);

    await array.map((i) => {
      this.setState({
        pickupId: i.pickup_id,
        pickup_person: i.pickup_person,
        home_address: i.home_address,
        office_address: i.office_address,
        mobile: i.mobile,
        preferred_start_time: i.preferred_start_time,
        preferred_end_time: i.preferred_end_time,
        pickup_date: i.pickup_date,
      });
    });

    this.setState({Activity_array: Activity_Array, loading: false});
    console.warn('pod', this.state.pickupId);
  };

  validate = () => {
    if (this.state.image == '') {
      Snackbar.show({
        text: 'Please Select The POD Image',
        duration: Snackbar.LENGTH_LONG,
      });
    } else if (this.state.comment == '') {
      Snackbar.show({
        text: 'Please Enter Delivery Number',
        duration: Snackbar.LENGTH_LONG,
      });
    } else {
      this.setState({loading: true});
      this.Save();
    }
  };

  Save = async () => {
    await console.warn(
      'all adata',
      this.state.pickupId,
      this.state.comment,
      this.state.Activity_array,
      this.state.image,
    );

    this.setState({loading: true});
    const data = new FormData();
    data.append('pickupId', this.state.pickupId);
    data.append('delivery_number', this.state.comment);
    data.append('activity_id', this.state.Activity_array.toString());
    data.append('pod_number', {
      uri: this.state.image,
      type: 'image/png', // or photo.type
      name: `${Date.now()}-pod_number_docboyz.jpg`,
    });
    console.warn('data', data);
    fetch('https://docboyz.in/docboyzmt/api/activity_pickup_submit_new', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: data,
    })
      .then((response) => response.json())
      .then((res) => {
        console.warn(res);
        if (res.error == 0) {
          Snackbar.show({
            text: 'Pickup documents saved successfully',
            duration: Snackbar.LENGTH_LONG,
          });
          this.props.navigation.replace('pickup');
          this.setState({loading: false});
        } else {
          Snackbar.show({
            text: 'Please Try Again...',
            duration: Snackbar.LENGTH_LONG,
          });
          this.setState({loading: false});
        }
      })
      .catch((err) => {
        console.warn('error', err),
          console.warn('error', err.code),
          console.warn('error', err.message),
          this.setState({loading: false});
        Snackbar.show({
          text: 'Something went wrong...',
          duration: Snackbar.LENGTH_LONG,
        });
      });
  };

  POD_Image = (cropping, mediaType = 'photo') => {
    ImagePicker.openCamera({
      cropping: cropping,
      width: 1000,
      height: 300,
      includeExif: true,
      mediaType,
    })
      .then((response) => {
        console.warn('received image', response);
        this.setState({image: response.path});
        // this.ftuCall();
      })
      .catch((e) => alert(e));
  };

  ftuCall = async () => {
    const f = await AsyncStorage.getItem('FTU');
    if (f == 1) {
      this.props.navigation.navigate('PodNumber');
    }
  };

  render() {
    console.warn(this.state.image);
    if (this.state.loading == true) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="black" />
        </View>
      );
    }
    let {comment} = this.state;
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View style={styles.circleView}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.circleText}>{this.state.pickup_person}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                type="material-community"
                name={'phone'}
                size={normalize(14)}
                color="mediumseagreen"
              />
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    'Call',
                    `Do you want to call ${this.state.mobile}`,
                    [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: () => this.call(this.state.mobile),
                      },
                    ],
                    {
                      cancelable: false,
                    },
                  )
                }>
                <Text style={styles.circleText1}>{this.state.mobile}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.panelBody}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Icon
                type="material-community"
                name={'clipboard-text'}
                size={normalize(15)}
                color="mediumseagreen"
              />

              <Text style={styles.panelHeader}>{this.state.pickup_date}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Icon
                type="material-community"
                name={'clock-outline'}
                size={normalize(15)}
                color="mediumseagreen"
              />
              <Text style={styles.panelHeader}>
                {this.state.preferred_start_time} -{' '}
                {this.state.preferred_end_time}
              </Text>
            </View>
          </View>
          <View style={styles.panel}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Icon
                type="material-community"
                name={'map-marker-multiple'}
                size={normalize(15)}
                color="mediumseagreen"
              />
              <Text style={styles.panelHeader}>CHECK_AMOUNT:</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginLeft: 25,
              }}>
              <Icon
                type="material-community"
                name={'map-marker-multiple'}
                size={17}
                color="mediumseagreen"
              />
              <Text style={styles.panelHeader}>LOAN_AMOUNT:</Text>
            </View>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.insideView}>
            <Icon
              type="material-community"
              name={'home'}
              size={normalize(18)}
              color="mediumseagreen"
            />
            <Text style={styles.address}>{this.state.home_address}</Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.insideView1}>
            <View style={styles.insideView}>
              <Icon
                type="material-community"
                name={'wallet-travel'}
                size={normalize(18)}
                color="mediumseagreen"
              />
              <Text style={styles.address}>{this.state.office_address}</Text>
            </View>
          </View>
        </View>
        <View style={{justifyContent: 'center',}}>
          <View style={styles.Image}>
            {this.state.image == '' ? (
              <TouchableOpacity
                style={styles.opacity}
                onPress={() => this.POD_Image()}>
                <Image
                  style={{
                    width: normalize(70),
                    height: normalize(70),
                    alignSelf: 'center',
                  }}
                  source={require('../assets/circle-add.png')}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.opacity}
                onPress={() => this.POD_Image()}>
                <Image
                  style={{
                    width: normalize(100),
                    height: normalize(150),
                  }}
                  source={{uri: this.state.image}}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={{backgroundColor: '#FFF'}}>
            <TextField
              label="Enter Delivery Number"
              tintColor={'black'}
              value={comment}
              onChangeText={(comment) => this.setState({comment})}
              containerStyle={styles.textInput}
              multiline={true}
            />
            <TouchableHighlight
              style={styles.button}
              onPress={this.validate}
              underlayColor="deepskyblue">
              <Text style={styles.buttonText}>Submit POD</Text>
            </TouchableHighlight>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
