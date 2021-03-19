import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ToastAndroid,
  ActivityIndicator,
  PixelRatio,
  PermissionsAndroid,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import NetInfo from '@react-native-community/netinfo';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';
var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
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
export default class NotificationsScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      mobileText: '',
      isVisble: false,
      mob: '',
      isDisable: false,
      loading: false,
      isNumber: true,
      email: '',
      sendParam: '',
      connection_Status: '',
    };
  }

  checkSim = () => {
    const no = RNSimData.getSimInfo();
    console.warn('new is ', no);
  };

  isClosed = () => {
    this.setState({isVisble: false});
  };

  async componentDidMount() {
    NetInfo.fetch().then(async (state) => {
      if (state.isConnected == true) {
        this.setState({connection_Status: 'Online'});
      } else {
        this.setState({connection_Status: 'Offline'});
        Snackbar.show({
          title: 'Please turn on internet',
          duration: Snackbar.LENGTH_LONG,
        });
        this.setState({connection_Status: 'Offline'});
      }
      await AsyncStorage.getItem('token', (err, result) => {
        this.setState({token: result});
      });
    });
  }

  async requestReadSmsPermission() {
    // read sms
    try {
      var granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'Auto Verification OTP',
          message: 'need access to read sms, to verify OTP',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('sms read permissions granted', granted);
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          {
            title: 'Receive SMS',
            message: 'Need access to receive sms, to verify OTP',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('RECEIVE_SMS permissions granted', granted);
        } else {
          console.warn('RECEIVE_SMS permissions denied');
        }
      } else {
        console.warn('sms read permissions denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  apiCall = () => {
    if (this.state.email != '') {
      this.apiEmail();
    } else {
      this.apiPhone();
    }
  };

  apiEmail = async () => {
    this.setState({loading: true});
    var email = this.state.email;
    console.warn('Email : ' + email);
    await fetch('https://docboyz.in/docboyzmt/api/multitenantOtp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_id: email,
      }),
    })
      .then((response) => response.json())
      .then((resData) => {
        console.warn(resData);
        if (resData.error == 0) {
          console.warn('inside error');
          if (resData.OTP) {
            this.setState({loading: false, isDisable: false});
            this.props.navigation.replace('OTP', {
              Data: this.state.mobileText,
              AllData: resData,
              EmailId: this.state.email,
            });
            this.setState({email: '', isDisable: false});
          } else {
            this.setState({email: '', isDisable: false, loading: false});

            Snackbar.show({
              title: 'Something wrong please after sometime',
              duration: Snackbar.LENGTH_LONG,
            });
            console.warn('Its not working');
          }
        } else if (resData.error == 1) {
          if (resData.exists == true) {
            this.setState({email: '', isDisable: false, loading: false});
            Alert.alert(
              'Email already exist',
              'You have more than 1 account.Please try again.',
              [
                {
                  text: 'Ok',
                  onPress: () => console.warn('Cancel Pressed!'),
                },
              ],
            );
          }
        } else if (resData.error == 2) {
          if (resData.exists == true) {
            this.setState({mobileText: '', isDisable: false, loading: false});

            Alert.alert(
              'Inactive account',
              'Your account is inactive.Please contact your admin.',
              [
                {
                  text: 'Ok',
                  onPress: () => console.warn('Cancel Pressed!'),
                },
              ],
            );
          }
        } else {
          this.setState({email: '', isDisable: false, loading: false});

          Snackbar.show({
            title: 'Something wrong please try again',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      })
      .catch((error) => {
        Snackbar.show({
          title: 'Something wrong please try again',
          duration: Snackbar.LENGTH_LONG,
        });

        console.warn('catch error found', error.message);
        console.log('catch error found', error.message);

        ToastAndroid.show(
          'Something wrong please try again !',
          ToastAndroid.LONG,
        );

        this.setState({loading: false, isDisable: false});
      });
  };

  apiPhone = async () => {
    this.setState({loading: true});
    var ph = this.state.mobileText;
    await fetch('https://docboyz.in/docboyzmt/api/multitenantOtp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile_number: ph,
      }),
    })
      .then((response) => response.json())
      .then((resData) => {
        console.warn(resData);
        this.setState({loading: false});

        if (resData.error == 0) {
          console.warn('inside error');
          if (resData.OTP) {
            this.setState({loading: false, isDisable: false});
            console.warn(
              'Logn Data',
              this.state.mobileText,
              resData,
              this.state.email,
            );
            this.props.navigation.replace('OTP', {
              Data: this.state.mobileText,
              AllData: resData,
              EmailId: this.state.email,
            });
            this.setState({mobileText: '', isDisable: false});
          } else {
            this.setState({mobileText: '', isDisable: false, loading: false});

            Snackbar.show({
              title: 'Something wrong please try after sometime',
              duration: Snackbar.LENGTH_LONG,
            });
            console.warn('Its not working');
          }
        } else if (resData.error == 1) {
          if (resData.exists == true) {
            this.setState({mobileText: '', isDisable: false, loading: false});

            Alert.alert(
              'Number already exist',
              'You have more than 1 account to this number.Please try again with same number.',
              [
                {
                  text: 'Ok',
                  onPress: () => console.warn('Cancel Pressed!'),
                },
              ],
            );
          }
        } else if (resData.error == 2) {
          if (resData.exists == true) {
            this.setState({mobileText: '', isDisable: false, loading: false});

            Alert.alert(
              'Inactive account',
              'Your account is inactive.Please contact your admin.',
              [
                {
                  text: 'Ok',
                  onPress: () => console.warn('Cancel Pressed!'),
                },
              ],
            );
          }
        } else {
          this.setState({mobileText: '', isDisable: false, loading: false});

          Snackbar.show({
            title: 'Something wrong please try again',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      })
      .catch((error) => {
        Snackbar.show({
          title: 'Something wrong please try again',
          duration: Snackbar.LENGTH_LONG,
        });
        console.warn('catch error found', error.message);
        ToastAndroid.show(
          'Something wrong please try again !',
          ToastAndroid.LONG,
        );

        this.setState({loading: false, isDisable: false});
      });
  };

  callFun = async () => {
    this.setState({isDisable: true});
    if (this.state.email !== '' || this.state.mobileText != '') {
      this.setState({email: this.state.email.trim()});

      if (this.state.mobileText != '') {
        if (this.state.mobileText.length === 10) {
          this.apiCall();
        } else {
          alert('please enter 10 digit number');
          this.setState({isDisable: false});
        }
      } else if (reg.test(this.state.email)) {
        this.apiCall();
      } else {
        alert('please enter valid email');
        this.setState({isDisable: false});
      }
    } else {
      alert('Field should not be blank');
      this.setState({isDisable: false});
    }
  };

  firstSim = () => {
    this.setState({mobileText: this.state.mob, isVisble: false});
  };
  secondSim = () => {
    this.setState({mobileText: this.state.mob, isVisble: false});
  };

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.Container}>
        <View style={styles.Container}>
          <Modal
            transparent={true}
            animationType="fade"
            visible={this.state.isVisble}>
            <View style={styles.modelView}>
              <View style={styles.dialog}>
                <Text style={styles.continue}>Continue with</Text>
                <View style={styles.simNumbers}>
                  <Image
                    source={require('../assets/sim.png')}
                    style={styles.img}
                  />
                  <TouchableOpacity onPress={() => this.firstSim()}>
                    <Text style={styles.mobText}>{this.state.mob}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => this.isClosed()}
                  style={styles.colse}>
                  <Text style={styles.none}>None of above</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.first}>
            <Image
              source={require('../assets/DOCBOYZ.png')}
              style={styles.image1}
            />
            <Text style={styles.text}>DocBoyz</Text>
          </View>

          <View style={styles.second}>
            {this.state.isNumber ? (
              <View style={styles.input}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    style={styles.image}
                    source={require('../assets/flagIndia.png')}
                  />
                  <Text style={styles.number}>+91</Text>
                </View>
                <TextInput
                  //onTouchStart={()=>this.callD()}
                  style={styles.numberInput}
                  placeholder="Mobile Number"
                  underlineColor="transparent"
                  mode="flat"
                  theme={{
                    colors: {
                      placeholder: 'grey',
                      text: 'black',
                      primary: 'white',
                      underlineColor: 'transparent',
                    },
                  }}
                  style={styles.inputBox}
                  keyboardType={'number-pad'}
                  maxLength={10}
                  autoFocus={false}
                  onChangeText={(text) => this.setState({mobileText: text})}
                  value={this.state.mobileText}
                />
              </View>
            ) : (
              <TextInput
                label="Email"
                mode="outlined"
                underlineColor="transparent"
                theme={{
                  colors: {
                    placeholder: 'grey',
                    text: 'black',
                    primary: '#313131',
                    underlineColor: 'transparent',
                  },
                }}
                TextInputOutlined="red"
                style={styles.emailInput}
                value={this.state.email}
                onChangeText={(email) => this.setState({email})}
              />
            )}

            <TouchableOpacity
              onPress={() =>
                this.state.isNumber
                  ? this.setState({isNumber: false, mobileText: ''})
                  : this.setState({isNumber: true, email: ''})
              }>
              {this.state.isNumber ? (
                <Text style={styles.lebal}>Use Email</Text>
              ) : (
                <Text style={styles.lebal}>Use Phone</Text>
              )}
            </TouchableOpacity>

            <View>
              {this.state.loading ? (
                <Modal transparent={true} visible={true}>
                  <View style={styles.loadingView}>
                    <View style={styles.loadingBox}>
                      <ActivityIndicator size="large" color="black" />
                      <Text style={styles.pleaseWait}>Please wait</Text>
                    </View>
                  </View>
                </Modal>
              ) : null}
            </View>

            <TouchableOpacity
              disabled={this.state.isDisable}
              onPress={() => this.callFun()}
              style={styles.button}>
              <Text style={styles.buttonText}>Login / SignUp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
