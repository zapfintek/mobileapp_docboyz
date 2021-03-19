import React from 'react';
import {
  View,
  ScrollView,
  TouchableHighlight,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  TextInput,
  FlatList,
  Button,
  Alert,
  PixelRatio,Dimensions
} from 'react-native';
import Modal from 'react-native-modal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {TextField} from 'react-native-material-textfield';
import {Header, Icon} from 'react-native-elements';
import {Appbar, Card} from 'react-native-paper';
import styles from './styles';
import Snackbar from 'react-native-snackbar';
import Lightbox from 'react-native-lightbox';
import SwiperFlatList from 'react-native-swiper-flatlist';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import RadioForm from 'react-native-simple-radio-button';

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

let gender = [
  {label: ' Male      ', value: 'male'},
  {label: ' Female ', value: 'female'},
];
let account = [
  {label: ' Current    ', value: 'Current'},
  {label: ' Saving ', value: 'Saving'},
];

export default class Myaccount extends React.Component {
  static navigationOptions = {
    drawerLockMode: 'locked-closed',
    drawerLabel: 'My Account',
  };

  constructor() {
    super();
    this.state = {
      partnerId: '',
      isSave: true,
      documents: {},
      modalVisible: false,
      isModalVisible: false,
      companyList: [],
      profielData: '',
      bankdetails:[],
      profielData:[],
      Docs:[],
      loading:true,
      Cheque_book:'',
      Account_Uri:'',
      Aadhar_back:'',
      Adharcard_Uri:''
    };
    this.profile();
  }

  AdharCard = () => {
    const options = {
      quality: 1.0,
      maxWidth: 300,
      maxHeight: 300,
      storageOptions: {
        skipBackup: false,
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let Adharcard_Uri = [
          {
            uri: response.uri,
          },
          ...this.state.Adharcard_Uri,
        ];
        this.setState({
          Adharcard_Uri: Adharcard_Uri,
        });
      }
    });
  };

  Acoount = () => {
    const options = {
      quality: 1.0,
      maxWidth: 300,
      maxHeight: 300,
      storageOptions: {
        skipBackup: false,
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let Account_Uri = [{uri: response.uri}, ...this.state.Account_Uri];
        this.setState({Account_Uri: Account_Uri});
      }
    });
  };

  PanCard_Back = () => {
    const options = {
      quality: 1.0,
      maxWidth: 300,
      maxHeight: 300,
      storageOptions: {
        skipBackup: false,
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let PanCard_Uri = [
          {
            uri: response.uri,
          },
          ...this.state.PanCard_Uri,
        ];
        this.setState({
          PanCard_Uri: PanCard_Uri,
        });
      }
    });
  };

  profile = async () => {
    await AsyncStorage.getItem('AGENT_ID', (err, result) => {
      if (result != '') {
        this.setState({
          agentId: result,
        });
      }
    });
    this.setState({loading: true});
    let {agentId} = this.state;
    await fetch('https://docboyz.in/docboyzmt/api/viewProfileSigned', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({agentId: agentId}),
    })
      .then(
        (response) => response.json(), //ADDED >JSON() HERE
        (error) => console.log('An error occurred.', error),
      )
      .then((res) => {
        console.warn('profile', res.user.documents);
        this.setState({profielData: res.user,
          bankdetails:res.user.bankdetails,Docs:res.user.documents,
          loading: false});
        let {error, user: user} = res;
        this.setState({status: user.doc_status});
        if (user.company_partners.length > 0) {
          this.setState({companyList: user.company_partners});
        }
      })
      .catch((error) => {
        this.setState({loading: false});
        console.log(error);
      });

    await this.setState({radio: this.state.gender});
    await this.setState({Account: this.state.account}, () => {
    });
  };

  deleteAddhar = () => {
    this.setState({Adharcard_Uri: ''});
  };
  deletepan = () => {
    this.setState({PanCard_Uri: ''});
  };
  deleteAccount = () => {
    this.setState({Account_Uri: ''});
  };

  validate = async () => {
    let {
      Account_Uri,
      Adharcard_Uri,
    } = this.state;

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (Account_Uri.length != 1) {
      Snackbar.show({
        text: 'Please select only Cheque Front picture',
        duration: Snackbar.LENGTH_LONG,
      });
    } else if (Adharcard_Uri.length != 1) {
      Snackbar.show({
        text: 'Please select the adhar_card back image',
        duration: Snackbar.LENGTH_LONG,
      });
    } else {
      this.Save();
    }
  };

  savePartnerId = async () => {
    this.setState({loading: true});
    if (this.state.partnerId.trim() != '') {
      await fetch('https://docboyz.in/docboyzmt/api/add_company_partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: this.state.agentId,
          customer_id: this.state.partnerId,
        }),
      })
        .then((res) => res.json())
        .then((resData) => {
          if (resData.error == 0) {
            this.setState({partnerId: '', loading: false});
            Snackbar.show({
              text: 'Partner added successfully.',
              duration: Snackbar.LENGTH_LONG,
            });
            this.profile();
          } else if (resData.error == 1) {
            if (resData.message == 'No such Company Exists !') {
              this.setState({partnerId: '', loading: false});
              Snackbar.show({
                text: 'No such company exists !.',
                duration: Snackbar.LENGTH_LONG,
              });
            } else {
              this.setState({partnerId: '', loading: false});
              Snackbar.show({
                text: 'This partner already added.',
                duration: Snackbar.LENGTH_LONG,
              });
            }
          } else {
            this.setState({partnerId: '', loading: false});
            Snackbar.show({
              text: 'No such a company exist.',
              duration: Snackbar.LENGTH_LONG,
            });
          }
        })
        .catch((error) => {
          console.warn('Error' + error.message);
        });
    } else {
      this.setState({loading: false});
      Snackbar.show({
        text: 'Please enter partner id.',
        duration: Snackbar.LENGTH_LONG,
      });
    }
  };

  Save = async () => {
    const [first, second] = await this.state.Account_Uri;
    const {uri: cheque_book1} = await first;
    const [six] = await this.state.Adharcard_Uri;
    const {uri: adharcard2} = await six;

    await this.setState({
      ChequeFirst: cheque_book1,
      AdharSecond: adharcard2,
      loading: true,
    });

    const data = new FormData();
    data.append('agent_id', this.state.agentId);
    data.append('cheque', {
      uri: this.state.ChequeFirst,
      type: 'image/png', // or photo.type
      name: `${Date.now()}.chequeImage1.jpg`,
    });
    data.append('cheque_back', {
      uri: this.state.ChequeFirst,
      type: 'image/png', // or photo.type
      name: `${Date.now()}.chequeImage1.jpg`,
    });

    data.append('adharcard_back', {
      uri: this.state.AdharSecond,
      type: 'image/png', // or photo.type
      name: `${Date.now()}Adharcard2.jpg`,
    });

    data.append('pancard_back', {
      uri: this.state.Pancard,
      type: 'image/png', // or photo.type
      name: `${Date.now()}PanCard1.jpg`,
    });

    fetch('https://docboyz.in/docboyzmt/api/agent_edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: data,
    })
      .then((response) => response.json())
      .then((response) => {
        console.warn('Success:', response);
        if (response.error == 0) {
          Snackbar.show({
            text: 'Agent Info edited Successfully',
            duration: Snackbar.LENGTH_LONG,
          });
          this.profile();
        } else {
          Snackbar.show({
            text: 'Sorry..Something Wrong!',
            duration: Snackbar.LENGTH_LONG,
          }),
            this.setState({
              loading: false,
            });
        }
      })
      .catch((error) => {
        this.setState({loading: false});
      });
  };

  toggleModal = () => {
    if (this.state.companyList.length > 0) {
      this.setState({isModalVisible: !this.state.isModalVisible});
    } else {
      Alert.alert('', 'No company found', [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ]);
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            backgroundColor: 'white',
          }}>
          <Header
            backgroundColor="red"
            leftComponent={{
              icon: 'arrow-back',
              color: '#fff',
              onPress: () => {
                this.props.navigation.replace('MyDrawer');
              }, // is a dashboard screen
            }}
            centerComponent={{
              text: 'My Account',
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
          <ActivityIndicator size="large" color="black" />
          <View></View>
        </View>
      );
    }

    return (
   
        <View>
          <Modal
            isVisible={this.state.isModalVisible}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            animationOutTiming={800}
            animationInTiming={500}
            deviceHeight={1000}
            backdropColor="black"
            backdropOpacity={0.7}
            style={{justifyContent: 'center'}}>
            <View style={styles.modal}>
              <View style={styles.modalDialog}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      margin: 10,
                      color: 'black',
                      width: '75%',
                      fontWeight: 'bold',
                      fontStyle: 'italic',
                    }}>
                    Your partner company
                  </Text>
                  <TouchableOpacity
                    onPress={this.toggleModal}
                    style={{justifyContent: 'flex-end', margin: 10}}>
                    <Icon
                      type="material-community"
                      name={'close'}
                      size={25}
                      color="red"
                      containerStyle={{}}
                    />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={this.state.companyList}
                  renderItem={({item}) => (
                    <Card
                      style={{
                        flex: 1,
                        margin: 5,
                        paddingTop: 5,
                        paddingLeft: 10,
                        paddingRight: 5,
                        paddingBottom: 15,
                        elevation: 5,
                      }}>
                      <Text style={{fontSize: 14, margin: 5, color: 'black'}}>
                        {item.company_name}
                      </Text>
                    </Card>
                  )}
                  keyExtractor={(text) => {
                    text.customer_id;
                  }}
                />
              </View>
            </View>
          </Modal>
          <Header
              backgroundColor="red"
              leftComponent={{
                icon: 'arrow-back',
                color: '#fff',
                onPress: () => {
                  this.props.navigation.replace('MyDrawer');
                }, // is a dashboard screen
              }}
              centerComponent={{
                text: 'My Account',
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
      <KeyboardAwareScrollView contentContainerStyle={styles.Container}>
          <View style={{backgroundColor: '#FFF'}}>
            {this.state.Image == '' ? (
              <View
                style={{
                  alignSelf: 'center',
                  width:normalize(80),
                  height: normalize(80),
                  borderRadius: 100,
                  margin: normalize(10),
                }}>
                <Image
                  source={require('../assets/profile_defaults.png')}
                  style={styles.avatar}
                />
              </View>
            ) : (
              <View
                style={{
                  alignSelf: 'center',
                  width:normalize(80),
                  height: normalize(80),
                  borderRadius: 100,
                  margin: normalize(10),
                }}>
                <Image
                  source={{
                    uri:  typeof this.state.profielData.profile_pic != 'undefined'
                    ? this.state.profielData.profile_pic
                    : null
                  }}
                  resizeMode="cover"
                  style={styles.avatar}
                />
              </View>
            )}
          </View>
     
          <View style={{backgroundColor: '#FFFFFF'}}>
            <TextField
              label="Email"
              tintColor={'black'}
              value={typeof this.state.profielData.email != 'undefined'? this.state.profielData.email: null}
              onChangeText={(email) => this.setState({email})}
              containerStyle={{width:'80%',alignSelf:'center' }}
              editable={false}
            />
          </View>

          {/* <View
            style={{
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
              padding: 5,
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 7,
            }}>
            <Text style={{marginLeft: 20, fontSize: 16, marginRight: 10}}>
              Add partner Id :
            </Text>
            <TextInput
              placeholder="Enter Id"
              keyboardType={'number-pad'}
              editable={true}
              autoFocus={true}
              multiline={true}
              value={this.state.partnerId}
              onChangeText={(partnerId) => this.setState({partnerId})}
              style={styles.partner}
            />
            <TouchableOpacity
              onPress={() => this.savePartnerId()}
              style={{
                borderRadius: 5,
                backgroundColor: '#1B547C',
                paddingTop: 5,
                marginLeft: 5,
                paddingLeft: 10,
                paddingRight: 10,
                paddingBottom: 5,
              }}>
              <Text style={{fontSize: 18, color: 'white'}}>Save</Text>
            </TouchableOpacity>
          </View> */}

          {/* <View
            style={{
              flex: 1,
              padding: 5,
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 15,
            }}>
            <TouchableOpacity
              onPress={this.toggleModal}
              style={{marginLeft: 20, marginRight: 10}}>
              <Text
                style={{
                  fontSize: 17,
                  color: '#1B547C',
                  fontWeight: 'bold',
                  textAlign: 'right',
                }}>
                My partner
              </Text>
            </TouchableOpacity>
          </View> */}

          <Text
            style={{
              alignSelf: 'center',
              color: 'teal',
              fontWeight: 'bold',
              fontSize: 17,
              margin: 3,
            }}>
            Name and other Details
          </Text>
          <View style={{backgroundColor: '#FFF'}}>
            <TextField
              label="Name"
              tintColor={'black'}
              value={typeof this.state.profielData.name != 'undefined'? this.state.profielData.name: null}
              onChangeText={(name) => this.setState({name})}
              containerStyle={{width:'80%',alignSelf:'center' }}
              editable={false}
            />
            <TextField
              label="Birthday"
              value={typeof this.state.profielData.dob != 'undefined'? this.state.profielData.dob: null}
              tintColor={'black'}
              onChangeText={(DateText) => this.setState({DateText})}
              containerStyle={{
                marginBottom: -15,
                marginLeft: 30,
                marginRight: 30,
              }}
              editable={false}
            />
            <View
              style={{
                backgroundColor: '#FFF',
                marginLeft: 30,
                marginRight: 30,
                marginTop: 18,
                marginBottom: -12,
              }}>
              <RadioForm
                radio_props={gender}
                initial={this.state.radio === 'female' ? 1 : 0}
                onPress={(value) => {
                  this.setState({gender: value});
                }}
                formHorizontal={true}
                labelColor={'#000'}
                buttonColor={'gray'}
                selectedButtonColor={'gray'}
                style={{
                  alignSelf: 'center',
                }}
                disabled={true}
              />
            </View>
            <TextField
              label="Address Line 1"
              value={typeof this.state.profielData.address1 != 'undefined'? this.state.profielData.address1: null}
              tintColor={'black'}
              onChangeText={(address1) => this.setState({address1})}
              containerStyle={{
                marginTop: 10,
                marginLeft: 30,
                marginRight: 30,
              }}
              editable={false}
            />
            <TextField
              label="Address Line 2"
              value={typeof this.state.profielData.address2 != 'undefined'? this.state.profielData.address2: null}
              tintColor={'black'}
              onChangeText={(address2) => this.setState({address2})}
              containerStyle={{
                marginBottom: -15,
                marginLeft: 30,
                marginRight: 30,
              }}
              editable={false}
            />
            <TextField
              label="State"
              value={typeof this.state.profielData.state != 'undefined'? this.state.profielData.state: null}
              tintColor={'black'}
              onChangeText={(state) => this.setState({state})}
              containerStyle={{
                marginBottom: -15,
                marginLeft: 30,
                marginRight: 30,
              }}
              editable={false}
            />
            <TextField
              label="City"
              value={typeof this.state.profielData.city != 'undefined'? this.state.profielData.city: null}
              tintColor={'black'}
              onChangeText={(city) => this.setState({city})}
              containerStyle={{
                marginTop: 10,
                marginLeft: 30,
                marginRight: 30,
              }}
              editable={false}
            />
            <TextField
              label="Pincode"
              value={typeof this.state.profielData.pincode != 'undefined'? this.state.profielData.pincode: null}
              tintColor={'black'}
              onChangeText={(pincode) => this.setState({pincode})}
              containerStyle={{
                marginBottom: -15,
                marginLeft: 30,
                marginRight: 30,
              }}
              editable={false}
            />
            <TextField
              label="Mobile No"
              value={typeof this.state.profielData.mobile != 'undefined'? this.state.profielData.mobile: null}
              tintColor={'black'}
              onChangeText={(mobile) => this.setState({mobile})}
              containerStyle={{
                marginBottom: 15,
                marginLeft: 30,
                marginRight: 30,
              }}
              editable={false}
            />
          </View>
          <Text
            style={{
              alignSelf: 'center',
              color: 'teal',
              fontWeight: 'bold',
              fontSize: 17,
              margin: 3,
              marginTop: 5,
            }}>
            Bank Details
          </Text>
          <View style={{backgroundColor: '#FFF'}}>
            <TextField
              label="Bank Name"
              value={typeof this.state.bankdetails.bank_name != 'undefined'? this.state.profielData.bankdetails.bank_name: null}
              tintColor={'black'}
              onChangeText={(bankName) => this.setState({bankName})}
              containerStyle={{
                marginLeft: 30,
                marginRight: 30,
                marginBottom: 20,
              }}
              editable={false}
            />
            {this.state.Cheque_book == '' ? (
              <View style={{backgroundColor: '#FFF', marginBottom: 5}}>
                {this.state.Account_Uri == '' ? (
                  <View
                    style={{
                      width: normalize(300),
                      height: normalize(150),
                      flexDirection: 'column',
                      justifyContent: 'center',
                      marginTop: 5,
                      alignSelf: 'center',
                      borderWidth: 0,
                      borderRadius: 5,
                    }}>
                    <TouchableOpacity onPress={this.Acoount.bind(this)}>
                      <Image
                        style={{
                          width: normalize(40),
                          height: normalize(40),
                          marginTop: 10,
                          alignSelf: 'center',
                        }}
                        source={require('../assets/circle-add.png')}
                      />
                      <Text
                        style={{
                          color: 'black',
                          alignSelf: 'center',
                          fontSize:normalize(13),
                          marginTop: 10,
                        }}>
                        Capture the front image of Cheque_book
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <View
                      style={{
                        width: normalize(300),
                        height: normalize(150),
                        flexDirection: 'column',
                        flex: 1,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        marginTop: 5,
                      }}>
                      <SwiperFlatList
                        ref="swiper"
                        ItemSeparatorComponent={this.renderSeparator}
                        autoplayLoop
                        autoplayDelay={2}
                        keyExtractor={(item, index) => index.toString()}
                        showPagination
                        paginationDefaultColor="lavender"
                        paginationActiveColor="red"
                        data={this.state.Account_Uri}
                        renderItem={({item: index}) => {
                          return (
                            <View style={styles.adharCard}>
                              <Lightbox
                                activeProps={
                                  (style = {height: '70%', width: '100%'})
                                }>
                                {
                                  <Image
                                    style={styles.adharCard}
                                    source={{uri: index.uri}}
                                  />
                                }
                              </Lightbox>
                            </View>
                          );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginTop: 20,
                        justifyContent: 'space-around',
                      }}>
                      {this.state.Account_Uri.length != 1 ? null : null}
                      <TouchableOpacity
                        style={[
                          styles.button,
                          {
                            width: normalize(100),
                            height: normalize(30),
                            backgroundColor: 'white',
                            borderColor: 'black',
                            borderRadius: 5,
                            justifyContent: 'flex-end',
                          },
                        ]}
                        onPress={this.deleteAccount}>
                        <Text
                          style={[
                            styles.buttonText,
                            {color: 'black', fontSize: 16},
                          ]}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View style={{alignSelf: 'center'}}>
                <Text style={{marginTop: 10, marginLeft: 30, marginRight: 30}}>
                  Cheque book
                </Text>
                <Image
                  source={{
                    uri: this.state.Cheque_book, //cheque book back image in pancard back parameter in state
                  }}
                  style={styles.avatar1}
                />
                <Text
                  style={{
                    marginTop: 10,
                    marginLeft: 30,
                    marginRight: 30,
                  }}></Text>
              </View>
            )}
            <TextField
              label="Account Number"
              value={typeof this.state.bankdetails.account_number != 'undefined'? this.state.profielData.bankdetails.account_number: null}
              keyboardType="number-pad"
              tintColor={'black'}
              onChangeText={(accountNumber) => this.setState({accountNumber})}
              containerStyle={{
                marginBottom: -15,
                marginLeft: 30,
                marginRight: 30,
              }}
              editable={false}
            />
            <TextField
              label="IFSC code"
              value={typeof this.state.bankdetails.ifsc_code != 'undefined'? this.state.profielData.bankdetails.ifsc_code: null}
              tintColor={'black'}
              onChangeText={(ifscCode) => this.setState({ifscCode})}
              containerStyle={{
                marginBottom: -5,
                marginLeft: 30,
                marginRight: 30,
              }}
              editable={false}
            />
            <View
              style={{
                backgroundColor: '#FFF',
                marginLeft: 30,
                marginRight: 30,
                marginTop: 15,
                marginBottom: 10,
              }}>
              <RadioForm
                radio_props={account}
                initial={this.state.Account === 'Current' ? 0 : 1}
                onPress={(value) => {
                  this.setState({account: value});
                }}
                formHorizontal={true}
                labelColor={'#000'}
                buttonColor={'gray'}
                selectedButtonColor={'gray'}
                style={{
                  alignSelf: 'center',
                }}
                disabled={true}
              />
            </View>
          </View>
          <Text
            style={{
              alignSelf: 'center',
              color: 'teal',
              fontWeight: 'bold',
              fontSize: 17,
              margin: 3,
            }}>
            Identification Document
          </Text>
          <View style={{backgroundColor: '#FFF', marginBottom: 5}}>
            <View
              style={{
                backgroundColor: '#FFF',
                marginLeft: 30,
                marginRight: 30,
              }}>
              <View style={{alignSelf: 'center'}}>
                <Text style={{marginTop: 10}}>Adhar1</Text>
                <Image
                    source={{
                      uri: 
                      typeof this.state.Docs.aadhar != 'undefined'?
                       this.state.Docs.aadhar: null
                    }}
                    style={styles.avatar1}
                  />
              </View>

              {this.state.Aadhar_back == '' ? (
                <View style={{backgroundColor: '#FFF', marginBottom: 5}}>
                  {this.state.Adharcard_Uri == '' ? (
                    <View
                      style={{
                        width: normalize(300),
                        height: normalize(150),
                        flexDirection: 'column',
                        justifyContent: 'center',
                        marginTop: 5,
                        alignSelf: 'center',
                        borderWidth: 0,
                        borderRadius: 5,
                      }}>
                      <TouchableOpacity onPress={this.AdharCard.bind(this)}>
                        <Image
                          style={{
                            width: normalize(40),
                            height: normalize(40),
                            marginTop: 10,
                            alignSelf: 'center',
                          }}
                          source={require('../assets/circle-add.png')}
                        />
                        <Text
                          style={{
                            color: 'black',
                            alignSelf: 'center',
                            marginTop: 10,
                            fontSize:normalize(13)
                          }}>
                          Capture the back image of Adhaar-card
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View>
                      <View
                        style={{
                          width: normalize(300),
                          height: normalize(250),
                          flexDirection: 'column',
                          flex: 1,
                          justifyContent: 'center',
                          alignSelf: 'center',
                          marginTop: 5,
                        }}>
                        <SwiperFlatList
                          ref="swiper"
                          ItemSeparatorComponent={this.renderSeparator}
                          autoplayLoop
                          autoplayDelay={2}
                          keyExtractor={(item, index) => index.toString()}
                          showPagination
                          paginationDefaultColor="lavender"
                          paginationActiveColor="red"
                          data={this.state.Adharcard_Uri}
                          renderItem={({item: index}) => {
                            return (
                              <View style={styles.adharCard}>
                                <Lightbox
                                  activeProps={
                                    (style = {height: '70%', width: '100%'})
                                  }>
                                  {
                                    <Image
                                      style={styles.adharCard}
                                      source={{uri: index.uri}}
                                    />
                                  }
                                </Lightbox>
                              </View>
                            );
                          }}
                          keyExtractor={(item, index) => index.toString()}
                          showsHorizontalScrollIndicator={false}
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          marginTop: 20,
                          justifyContent: 'space-around',
                        }}>
                        {this.state.Adharcard_Uri.length != 1 ? (
                          <TouchableOpacity
                            style={[
                              styles.button,
                              {
                                width: normalize(100),
                                height: normalize(30),
                                backgroundColor: 'white',
                                borderColor: 'black',
                                borderRadius: 5,
                              },
                            ]}
                            onPress={this.AdharCard.bind(this)}>
                            <Text
                              style={[
                                styles.buttonText,
                                {color: 'black', fontSize: normalize(14)},
                              ]}>
                              Add Image
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                        <TouchableOpacity
                          style={[
                            styles.button,
                            {
                              width: normalize(100),
                              height: normalize(30),
                              backgroundColor: 'white',
                              borderColor: 'black',
                              borderRadius: 5,
                              justifyContent: 'flex-end',
                            },
                          ]}
                          onPress={this.deleteAddhar}>
                          <Text
                            style={[
                              styles.buttonText,
                              {color: 'black', fontSize: normalize(14)},
                            ]}>
                            Delete
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <View style={{alignSelf: 'center', marginTop: 5}}>
                  <Text>Adhar2</Text>
                  <Image
                    source={{
                      uri: this.state.adharcard2
                    }}
                    style={styles.avatar1}
                  />
                </View>
              )}
              <View style={{alignSelf: 'center'}}>
                <Text>Pan Card</Text>
                <Image
                  source={{
                    uri:  typeof this.state.Docs.pan != 'undefined'?
                    this.state.Docs.pan: null
                  }}
                  style={styles.avatar1}
                />
              </View>
            </View>
          </View>
          {this.state.status == 0 ? (
            <View style={{flex: 1, backgroundColor: '#FFF', marginTop: 15}}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  paddingTop: 10,
                }}>
                <TouchableHighlight
                  style={[styles.button, {width: 130, height: 40}]}
                  onPress={this.validate}
                  underlayColor="deepskyblue">
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableHighlight>
              </View>
            </View>
          ) : null}
          </KeyboardAwareScrollView>
        </View>
      
    );
  }
}
