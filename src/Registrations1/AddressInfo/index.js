import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Card, TextInput} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'Zapfin1.db'});
import styles, {normalize} from './styles';

const AddressInfo = ({navigation}) => {
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [state, setStates] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [mobile, setMobile] = useState('1234567890');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    console.warn('cllde');
    db.transaction( function (tx) {
      tx.executeSql (
        'SELECT * FROM Registration WHERE mobile = ? ',
        [mobile],
         function (tx, results) {
          var len = results.rows.length;
          console.warn('len', results.rows.item(0).mobile);
          if (len > 0) {
            console.warn(results.rows.item(0))
            setAddress1(results.rows.item(0).address1),
            setAddress2(results.rows.item(0).address2),
            setStates(results.rows.item(0).state)
            setCity(results.rows.item(0).city),
            setPincode(results.rows.item(0).pincode),
            setMobile(results.rows.item(0).mobile)
            setLoading(false);       
          } else {
            console.warn('No user found');
            setLoading(false);
          }
        },
      );
    });
  }, []);

  const saveFistStep = () => {
    const validate = validation();
    if (validate) {
      setLoading(true);
      db.transaction(async (tx) => {
        tx.executeSql(
          'UPDATE Registration set address1=?, address2=? , state=? , city=?, pincode =? where mobile=?',
          [address1, address2, state, city, pincode, mobile],
          (tx, results) => {
            console.warn('Results', results.rowsAffected);
            navigation.navigate('AccountInfo');
            if (results.rowsAffected > 0) {
              console.warn('User updated successfully');
              navigation.navigate('AccountInfo');
              setLoading(false);
            }
          },
        );
      });
    }
  };

  const validation = () => {
    const regGST = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;

    if (address1 == '' || address2 == '') {
      Snackbar.show({
        text: 'Please enter the address',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (city == '' || state == '') {
      Snackbar.show({
        text: 'Please select city and state',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else if (pincode == '') {
      Snackbar.show({
        text: 'Please enter the pincode',
        duration: Snackbar.LENGTH_LONG,
      });
      return false;
    } else {
      return true;
    }
  };
  const saveFistStepBack = () => {
    navigation.replace('PersonalInfo', {
      mobile: mobile,
    });
  };
  // ***************************** State Api Calling ***************************************************

  let StateApi = async () => {
    console.warn('called');
    setLoading(true);
    await fetch('https://docboyz.in/docboyzmt/api/lookup_data', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Category: 'State',
        parentID: '',
      }),
    })
      .then(
        (response) => response.json(), //ADDED >JSON() HERE
        (error) => console.log('An error occurred.', error),
      )
      .then((res) => {
        console.warn(res.message);
        let array = res.message;
        var tempMarker = [];
        for (var p in array) {
          tempMarker.push({
            value: array[p].value,
            key: array[p].id,
          });
        }
        console.warn(array, tempMarker);
        setStateData(tempMarker);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        NetInfo.isConnected.fetch().then((isConnected) => {
          if (isConnected) {
            console.log('Internet is connected');
          } else {
            Snackbar.show({
              text: 'please check Internet Connection',
              duration: Snackbar.LENGTH_LONG,
            });
          }
        });
      });
  };

  // ***************************** City Api Calling ***************************************************

  const CityApi = async (val, k) => {
    console.warn('State cities ' + JSON.stringify(this.state.State));
    var key = this.state.State[k].key;

    this.setState({state: val});
    await fetch('https://docboyz.in/docboyzmt/api/lookup_data', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Category: 'City',
        parentID: key,
      }),
    })
      .then(
        (response) => response.json(), //ADDED >JSON() HERE
        (error) => console.log('An error occurred.', error),
      )
      .then((res) => {
        console.warn(res.message);
        let array = res.message;
        var tempMarker = [];
        for (var p in array) {
          tempMarker.push({
            value: array[p].value,
          });
        }
        setCityData(JSON.stringify(tempMarker));
      })
      .catch((error) => {
        setLoading(false);
        NetInfo.isConnected.fetch().then((isConnected) => {
          if (isConnected) {
            console.log('Internet is connected');
          } else {
            console.warn(this.state.token);
            Snackbar.show({
              title: 'please check Internet Connection',
              duration: Snackbar.LENGTH_LONG,
            });
          }
        });
        console.warn('error', error);
      });
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
        <ScrollView style={{flex: 1}}>
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
              iconStyle={{color: 'grey'}}
            />
            <Text style={[styles.text, {color: 'grey'}]}>..........</Text>
            <Icon
              type="material-community"
              name="folder-image"
              size={25}
              iconStyle={{color: 'grey'}}
            />
          </View>

          <Card style={styles.FirstCard}>
            <View style={styles.mainView}>
              <Text style={styles.heading}>Residence Details</Text>
            </View>

            <TextInput
              label="Address line 1"
              value={address1}
              onChangeText={(address1) => setAddress1(address1)}
              style={{backgroundColor: 'white', fontSize: 14, height: 55}}
            />

            <TextInput
              label="Address line 2"
              value={address2}
              onChangeText={(address2) => setAddress2(address2)}
              style={{backgroundColor: 'white', fontSize: 14, height: 55}}
            />
            <TextInput
              label="State"
              value={state}
              onChangeText={(state) => setStates(state)}
              style={{backgroundColor: 'white', fontSize: 14, height: 55}}
            />
            <TextInput
              label="City"
              value={city}
              onChangeText={(city) => setCity(city)}
              style={{backgroundColor: 'white', fontSize: 14, height: 55}}
            />
            <TextInput
              label="Pincode"
              value={pincode}
              onChangeText={(pincode) => setPincode(pincode)}
              style={{backgroundColor: 'white', fontSize: 14, height: 55}}
              keyboardType="numeric"
            />

            <View style={styles.bottomView}>
              <TouchableOpacity
                onPress={() => saveFistStepBack()}
                style={[styles.button, {backgroundColor: '#1B547C'}]}>
                <Text style={styles.text1}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => saveFistStep()}
                style={styles.button}>
                <Text style={styles.text1}>Next</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      )}
    </View>
  );
};
export default AddressInfo;
