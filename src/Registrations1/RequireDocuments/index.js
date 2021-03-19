import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Checkbox, Card} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';
import {Icon} from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import styles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {openDatabase} from 'react-native-sqlite-storage';
import {color} from 'react-native-reanimated';
var db = openDatabase({name: 'Zapfin1.db'});

const RequireDocuments = ({navigation}) => {
  const [adhaarFront, setAdhaarFront] = useState('');
  const [adhaarBack, setAdhaarBack] = useState('');
  const [cheque, setCheque] = useState('');
  const [name, setName] = useState('');
  const [pan, setPan] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobile, setMobile] = useState('1234567890');
  const [checked, setChecked] = useState(true);
  const [token, setToken] = useState('');
  const [allData, setAllData] = useState({});



  useEffect(() => {
    setLoading(true);
    console.warn('cllde');
    db.transaction( function (tx) {
      tx.executeSql (
        'SELECT * FROM Registration WHERE mobile = ? ',
        [mobile],
         function (tx, results) {
          var len = results.rows.length;
          console.warn('len', results.rows.item(0).account);
          if (len > 0) {
            console.warn(results.rows.item(0))
            setAdhaarFront(results.rows.item(0).adharcard1),
            setAdhaarBack(results.rows.item(0).adharcard2),
            setCheque(results.rows.item(0).cheque)
            setPan(results.rows.item(0).pancard),
            setName(results.rows.item(0).name),
            setMobile(results.rows.item(0).mobile)
            setAllData(results.rows.item(0))
            setLoading(false);   
            console.warn('all Data',allData);    
          } else {
            console.warn('No user found');
            setLoading(false);
          }
        },
      );
    });
  }, []);
  const saveFistStep = async () => {
    const validate = validation();
    if (validate) {
      setLoading(true);
      db.transaction(async (tx) => {
        tx.executeSql(
          'UPDATE Registration set adharcard1=?, adharcard2=? , cheque=? , account=?, pancard =? where mobile=?',
          [adhaarFront, adhaarBack, cheque, account, pan, mobile],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              // dataSend()
            }
          },
        );
      });
    }
  };

  const Demo=()=>{
    console.warn(allData)

  }

  const saveFistStepBack = async () => {
    navigation.replace('AccountInfo');
  };

  const dataSend = async () => {

    await AsyncStorage.getItem('token', (err, result) => {
      setToken(result)
    });

    var data = new FormData();
    //*******************************/ first step data *******************************
    data.append('email', email);
    data.append('name', name);
    data.append('mobile', mobile);
    data.append('dob', dob);
    data.append('gender', gender);
    data.append('profile_pic', {
      uri: pro_pic, // the profile  uri
      type: 'image/png', // or photo.type
      name: `${Date.now()}profilePicture.jpg`,
    });

    //*******************************second step data*************************************/
    data.append('address1', adds1);
    data.append('address2', adds2);
    data.append('state', state);
    data.append('city', city);
    data.append('pincode', pincode);
    data.append('agentType', 'p');
    data.append('agent_company_name', '')

    //************************* Third step data*******************************************/

    data.append('account_type', accountType);
    data.append('bank_name', bankName);
    data.append('account_number', accountNumber);
    data.append('ifsc_code', ifsc);
    data.append('pan_number', panNumber);

    //*********************************Forth step data******************************************/
   
    data.append('adharcard', {
      uri: adharcard, // the Adhaar  uri
      type: 'image/png', // or photo.type
      name: `${Date.now()}AdharCard1.jpg`,
    });

    data.append('adharcard_back', {
      uri: adharcard_back, // the Adhaar back  uri
      type: 'image/png', // or photo.type
      name: `${Date.now()}AdharCard2.jpg`,
    });

    data.append('pancard', {
      uri: pan, // the pan  uri
      type: 'image/png', // or photo.type
      name: `${Date.now()}Pancard.jpg`,
    });

    data.append('cheque', {
      uri: cheque, // the cheque uri
      type: 'image/png', // or photo.type
      name: `${Date.now()}Cheque.jpg`,
    });

    data.append('status', 'Pending');
    data.append('partnerID', ''); // send partner id
    data.append('partnerName', ''); // send partner name
    data.append('fcmTokenId', token);

    console.warn('Data to send ', JSON.stringify(data));

    await fetch('https://docboyz.in/docboyzmt/api/register_new', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: data,
    })
      .then((res) => res.json())
      .then((resData) => {
        console.warn('The response id ', resData);
        if (resData.error == 0) {
          AsyncStorage.setItem('FCnAME', name);
          AsyncStorage.setItem('AgentType', 'p');
          AsyncStorage.setItem('is_Existing', 'true');
          AsyncStorage.setItem('AGENT_ID', JSON.stringify(resData.agentId));
          Snackbar.show({
            text: 'Agent Register Successfully',
            duration: Snackbar.LENGTH_LONG,
          });
          navigation.replace('MyDrawer');
          setLoading(false);
        } else if (resData.error == 1) {
          Snackbar.show({
            text: resData.message,
            duration: Snackbar.LENGTH_LONG,
          }),
            setLoading(false);
        } else if (resData.error == 2) {
          setLoading(false);
          Snackbar.show({
            text: 'Something went wrong.Please try again!',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        Snackbar.show({
          text: 'Network error..!,please check internet connection',
          duration: Snackbar.LENGTH_LONG,
        });
      });
  };

  validation = () => {
    if (adhaarFront == '') {
      Snackbar.show({
        text: 'Capture the front image of adhaar card',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (adhaarBack == '') {
      Snackbar.show({
        text: 'Capture the back image of adhaar card',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (pan == '') {
      Snackbar.show({
        text: 'Capture the pan card image',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (cheque == '') {
      Snackbar.show({
        text: 'Capture the cheque image',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (checked == false) {
      Snackbar.show({
        text: 'Accept terms and conditions',
        duration: Snackbar.LENGTH_LONG,
      });
    } else {
      return true;
    }
  };

  const captureImage = (imageFor, cropping, mediaType = 'photo') => {
    console.warn('calling from ' + imageFor);
    ImagePicker.openCamera({
      cropping: cropping,
      width: 300,
      height: 300,
      includeExif: true,
      mediaType,
    })
      .then((image) => {
        console.warn('received image', image.path);
        if (imageFor == 'panCard') {
          setPan(image.path);
        } else if (imageFor == 'cheque') {
          setCheque(image.path);
        }
      })
      .catch((e) => alert(e));
  };

  const captureAdhar = (AdharType, cropping, mediaType = 'photo') => {
    if (adhaarFront == '' || AdharType == 'front') {
      Alert.alert('Adhaar Front', 'Capture the front image of adhaar card', [
        {
          text: 'Ok',
          onPress: () => {
            ImagePicker.openCamera({
              cropping: cropping,
              width: 300,
              height: 300,
              includeExif: true,
              mediaType,
            })
              .then((image) => {
                if (adhaarFront == '' || AdharType == 'front') {
                  setAdhaarFront(image.path);
                } else {
                  setAdhaarBack(image.path);
                }

                if (imageFor == 'panCard') {
                  setPan(image.path);
                } else if (imageFor == 'cheque') {
                  setCheque(image.path);
                }
              })
              .catch((e) => alert(e));
          },
        },
      ]);
    } else {
      Alert.alert('Adhaar Back', 'Capture the back image of adhaar card', [
        {
          text: 'Ok',
          onPress: () => {
            ImagePicker.openCamera({
              cropping: cropping,
              width: 300,
              height: 300,
              includeExif: true,
              mediaType,
            })
              .then((image) => {
                if (adhaarFront == '' || AdharType == 'front') {
                  setAdhaarFront(image.path);
                } else {
                  setAdhaarBack(image.path);
                }
              })
              .catch((e) => alert(e));
          },
        },
      ]);
    }
  };

  return (
    <View style={styles.PersonalContainer}>
      <StatusBar hidden={false} backgroundColor="red" />
      {loading ? (
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <ActivityIndicator size="large" color="black" />
          </View>
        </View>
      ) : (
        <KeyboardAwareScrollView>
          <View style={styles.loginSteps}>
            <Icon
              type="material-community"
              name="account-circle"
              size={30}
              iconStyle={styles.icon}
            />
            <Text style={styles.text}>..........</Text>
            <Icon
              type="material-community"
              name="home-circle"
              size={30}
              iconStyle={{color: '#d32f2f'}}
            />
            <Text style={styles.text}>..........</Text>
            <Icon
              type="material-community"
              name="bank"
              size={25}
              iconStyle={{color: '#d32f2f'}}
            />
            <Text style={styles.text}>..........</Text>
            <Icon
              type="material-community"
              name="folder-image"
              size={25}
              iconStyle={{color: '#d32f2f'}}
            />
          </View>

          <Card style={styles.FirstCard}>
            <View style={styles.mainView}>
              <Text style={styles.heading}>KYC Documents</Text>
            </View>

            <Text style={styles.text2}>Adhaar Card</Text>

            <View style={{marginTop: 10, flexDirection: 'row', padding: 5}}>
              <View
                style={{
                  height: 1,
                  backgroundColor: 'lightgrey',
                  marginTop: 5,
                }}></View>
              {adhaarFront == '' ? (
                <Text style={styles.text3}>
                  Click on add button and capture front and back image of adhaar
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    captureAdhar('front');
                  }}>
                  <Image style={styles.image} source={{uri: adhaarFront}} />
                </TouchableOpacity>
              )}
              {adhaarBack == '' ? null : (
                <TouchableOpacity
                  onPress={() => {
                    captureAdhar('back');
                  }}>
                  <Image style={styles.image1} source={{uri: adhaarBack}} />
                </TouchableOpacity>
              )}

              {adhaarFront && adhaarBack ? null : (
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      captureAdhar();
                    }}>
                    <Text style={styles.addText}>Add</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.divider}></View>

            <Text style={styles.text2}>Pan Card</Text>
            <View style={{flexDirection: 'row', padding: 5}}>
              {pan == '' ? (
                <Text style={styles.text3}>
                  Click on add button and capture the front image of pan card
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    captureImage('panCard');
                  }}>
                  <Image style={styles.image} source={{uri: pan}} />
                </TouchableOpacity>
              )}

              {pan == '' ? (
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      captureImage('panCard');
                    }}>
                    <Text style={styles.addText}>Add</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            <View style={styles.divider}></View>
            <Text style={styles.text2}>Cheque</Text>
            <View style={{flexDirection: 'row', padding: 5}}>
              {cheque == '' ? (
                <Text style={styles.text3}>
                  Click on add button and capture the front image of cheque
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    captureImage('cheque');
                  }}>
                  <Image style={styles.image} source={{uri: cheque}} />
                </TouchableOpacity>
              )}

              {cheque == '' ? (
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      captureImage('cheque');
                    }}>
                    <Text style={styles.addText}>Add</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            <View style={styles.divider}></View>
            <View style={styles.lastView}>
              <Checkbox
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked(!checked);
                }}
              />
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    'https://docboyz.in/admin_/public/uploads/DocBoyzTerms&Condition.pdf',
                  )
                }
                underlayColor="#E41313">
                <Text style={styles.text}>Terms and Conditions</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bottomView}>
              <TouchableOpacity
                onPress={() => saveFistStepBack()}
                style={[styles.button, {backgroundColor: '#1B547C'}]}>
                <Text style={styles.text1}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => saveFistStep()}
                style={styles.button}>
                <Text style={styles.text1}>Submit</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </KeyboardAwareScrollView>
      )}
    </View>
  );
};
export default RequireDocuments;
